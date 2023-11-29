import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/ShippingMethod/shippingMethod.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const displayStates = {
    DONE: 'done',
    EDITING: 'editing',
    INITIALIZING: 'initializing'
};

const serializeShippingMethod = method => {
    const { carrier_code, method_code } = method;

    return `${carrier_code}|${method_code}`;
};

const deserializeShippingMethod = serializedValue => {
    return serializedValue.split('|');
};

// Sorts available shipping methods by price.
const byPrice = (a, b) => a.amount.value - b.amount.value;

// Adds a serialized property to shipping method objects
// So they can be selected in the radio group.
const addSerializedProperty = shippingMethod => {
    if (!shippingMethod) return shippingMethod;

    const serializedValue = serializeShippingMethod(shippingMethod);

    return {
        ...shippingMethod,
        serializedValue
    };
};

const DEFAULT_SELECTED_SHIPPING_METHOD = null;
const DEFAULT_AVAILABLE_SHIPPING_METHODS = [];

export const useShippingMethod = props => {
    const { onSave, onSuccess, onError, setPageIsUpdating } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { getSelectedAndAvailableShippingMethodsQuery, setShippingMethodMutation } = operations;

    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

    /*
     *  Apollo Hooks.
     */
    const [setShippingMethodCall, { error: setShippingMethodError, loading: isSettingShippingMethod }] = useMutation(
        setShippingMethodMutation,
        {
            onCompleted: () => {
                onSuccess();
            }
        }
    );

    const { data, loading: isLoadingShippingMethods } = useQuery(getSelectedAndAvailableShippingMethodsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId,
        variables: { cartId }
    });

    /*
     *  State / Derived state.
     */
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [isErrorCalled, setIsErrorCalled] = useState(false);

    const derivedPrimaryShippingAddress =
        data && data.cart.shipping_addresses && data.cart.shipping_addresses.length
            ? data.cart.shipping_addresses[0]
            : null;

    const derivedSelectedShippingMethod = derivedPrimaryShippingAddress
        ? addSerializedProperty(derivedPrimaryShippingAddress.selected_shipping_method)
        : DEFAULT_SELECTED_SHIPPING_METHOD;

    const derivedShippingMethods = useMemo(() => {
        if (!derivedPrimaryShippingAddress) return DEFAULT_AVAILABLE_SHIPPING_METHODS;

        // Shape the list of available shipping methods.
        // Sort them by price and add a serialized property to each.
        const rawShippingMethods = derivedPrimaryShippingAddress.available_shipping_methods;
        const shippingMethodsByPrice = [...rawShippingMethods].sort(byPrice);
        const result = shippingMethodsByPrice.map(addSerializedProperty);

        // Move free shipping changes here so that other validations work correctly
        const isFreeShippingMethod = result && result.some(method => method.amount.value === 0);
        if (isFreeShippingMethod) {
            return result.filter(method => method.amount.value === 0);
        }

        return result;
    }, [derivedPrimaryShippingAddress]);

    const selectedShippingMethod = useMemo(() => {
        if (isLoadingShippingMethods || isSettingShippingMethod) {
            return derivedSelectedShippingMethod;
        }

        return derivedSelectedShippingMethod &&
            derivedShippingMethods.find(
                shippingMethod => shippingMethod.serializedValue === derivedSelectedShippingMethod.serializedValue
            )
            ? derivedSelectedShippingMethod
            : DEFAULT_SELECTED_SHIPPING_METHOD;
    }, [derivedSelectedShippingMethod, derivedShippingMethods, isLoadingShippingMethods, isSettingShippingMethod]);

    // When shipping methods are reloaded and the new shipping method is no longer available
    useEffect(() => {
        if (derivedSelectedShippingMethod && !selectedShippingMethod && !isErrorCalled) {
            onError();
            setIsErrorCalled(true);
        }
    }, [derivedSelectedShippingMethod, selectedShippingMethod, onError, isErrorCalled, setIsErrorCalled]);

    // Determine the component's display state.
    const isBackgroundAutoSelecting =
        isSignedIn && !derivedSelectedShippingMethod && Boolean(derivedShippingMethods.length);
    const displayState = selectedShippingMethod
        ? displayStates.DONE
        : isLoadingShippingMethods || (isSettingShippingMethod && isBackgroundAutoSelecting)
        ? displayStates.INITIALIZING
        : displayStates.EDITING;

    /*
     *  Callbacks.
     */
    const handleSubmit = useCallback(
        async value => {
            const [carrierCode, methodCode] = deserializeShippingMethod(value.shipping_method);

            try {
                await setShippingMethodCall({
                    variables: {
                        cartId,
                        shippingMethod: {
                            carrier_code: carrierCode,
                            method_code: methodCode
                        }
                    }
                });

                setIsErrorCalled(false);
            } catch {
                return;
            }

            setIsUpdateMode(false);
        },
        [cartId, setIsUpdateMode, setShippingMethodCall, setIsErrorCalled]
    );

    const handleCancelUpdate = useCallback(() => {
        setIsUpdateMode(false);
    }, []);

    const showUpdateMode = useCallback(() => {
        setIsUpdateMode(true);
    }, []);

    /*
     *  Effects.
     */

    // When we have data we should tell the checkout page
    // So that it can set the step correctly.
    useEffect(() => {
        if (selectedShippingMethod) {
            onSave();
        }
    }, [selectedShippingMethod, onSave]);

    useEffect(() => {
        setPageIsUpdating(isSettingShippingMethod);
    }, [isLoadingShippingMethods, isSettingShippingMethod, setPageIsUpdating]);

    // If an authenticated user does not have a preferred shipping method,
    // Auto-select the least expensive one for them.
    useEffect(() => {
        if (!data) return;
        if (!cartId) return;
        if (!isSignedIn) return;

        if (!derivedSelectedShippingMethod) {
            // The shipping methods are sorted by price.
            const leastExpensiveShippingMethod = derivedShippingMethods[0];

            if (leastExpensiveShippingMethod) {
                const { carrier_code, method_code } = leastExpensiveShippingMethod;

                setShippingMethodCall({
                    variables: {
                        cartId,
                        shippingMethod: {
                            carrier_code,
                            method_code
                        }
                    }
                });
            }
        }
    }, [cartId, data, derivedSelectedShippingMethod, derivedShippingMethods, isSignedIn, setShippingMethodCall]);

    const errors = useMemo(() => new Map([['setShippingMethod', setShippingMethodError]]), [setShippingMethodError]);

    return {
        displayState,
        errors,
        handleCancelUpdate,
        handleSubmit,
        isLoading: isLoadingShippingMethods || isSettingShippingMethod,
        isUpdateMode,
        selectedShippingMethod,
        shippingMethods: derivedShippingMethods,
        showUpdateMode,
        isUpdating: isSettingShippingMethod
    };
};
