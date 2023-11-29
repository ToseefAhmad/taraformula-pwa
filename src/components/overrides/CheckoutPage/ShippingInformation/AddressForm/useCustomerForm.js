import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo, useEffect } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './customerForm.gql';

export const useCustomerForm = props => {
    const { afterSubmit, onCancel, onSuccess, shippingData, isShippingPhoneNumberValid, formApiRef } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        createCustomerAddressMutation,
        updateCustomerAddressMutation,
        setCustomerAddressOnCartMutation,
        getCustomerQuery,
        getCustomerAddressesQuery,
        getDefaultShippingQuery
    } = operations;

    const [
        createCustomerAddress,
        { error: createCustomerAddressError, loading: createCustomerAddressLoading }
    ] = useMutation(createCustomerAddressMutation, {
        onCompleted: () => {
            onSuccess();
        }
    });

    const [
        updateCustomerAddress,
        { error: updateCustomerAddressError, loading: updateCustomerAddressLoading }
    ] = useMutation(updateCustomerAddressMutation, {
        onCompleted: () => {
            onSuccess();
        }
    });

    const [
        setCustomerAddressOnCart,
        { error: setCustomerAddressOnCartError, loading: setCustomerAddressOnCartLoading }
    ] = useMutation(setCustomerAddressOnCartMutation, {
        onCompleted: () => {
            onSuccess();
        }
    });

    const [{ cartId }] = useCartContext();

    const { data: customerData, loading: getCustomerLoading } = useQuery(getCustomerQuery);

    const isSaving = createCustomerAddressLoading || updateCustomerAddressLoading || setCustomerAddressOnCartLoading;

    // Simple heuristic to indicate form was submitted prior to this render
    const isUpdate = !!shippingData.city;

    const { country } = shippingData;
    const { code: countryCode } = country;

    let initialValues = {
        ...shippingData,
        country: countryCode
    };

    const hasDefaultShipping = !!customerData && !!customerData.customer.default_shipping;

    // For first time creation pre-fill the form with Customer data
    if (!isUpdate && !getCustomerLoading && !hasDefaultShipping) {
        const { customer } = customerData;
        const { email, firstname, lastname } = customer;
        const defaultUserData = { email, firstname, lastname };
        initialValues = {
            ...initialValues,
            ...defaultUserData
        };
    }

    // Force validation if current quotes shipping address phone number is incorrect
    useEffect(() => {
        if (!isShippingPhoneNumberValid && formApiRef && formApiRef.current) {
            formApiRef.current.validate();
        }
    }, [isShippingPhoneNumberValid, formApiRef]);

    const handleSubmit = useCallback(
        async formValues => {
            // eslint-disable-next-line no-unused-vars
            const { country, email, ...address } = formValues;
            try {
                const customerAddress = {
                    ...address,
                    // Cleans up the street array when values are null or undefined
                    street: address.street.filter(e => e),
                    country_code: country
                };

                if (isUpdate) {
                    const { id: addressId } = shippingData;
                    await updateCustomerAddress({
                        variables: {
                            addressId,
                            address: customerAddress
                        },
                        refetchQueries: [{ query: getCustomerAddressesQuery }]
                    });
                    // If address form was opened by force because of invalid phone number,
                    // We have to submit new customer address to quote.
                    if (!isShippingPhoneNumberValid && formApiRef && formApiRef.current) {
                        await setCustomerAddressOnCart({
                            variables: {
                                cartId,
                                addressId: addressId
                            }
                        });
                    }
                } else {
                    await createCustomerAddress({
                        variables: {
                            address: customerAddress
                        },
                        refetchQueries: [{ query: getCustomerAddressesQuery }, { query: getDefaultShippingQuery }]
                    });
                }
            } catch {
                return;
            }

            if (afterSubmit) {
                afterSubmit();
            }
        },
        [
            afterSubmit,
            createCustomerAddress,
            getCustomerAddressesQuery,
            getDefaultShippingQuery,
            isUpdate,
            shippingData,
            updateCustomerAddress,
            cartId,
            formApiRef,
            isShippingPhoneNumberValid,
            setCustomerAddressOnCart
        ]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const errors = useMemo(
        () =>
            new Map([
                ['createCustomerAddressMutation', createCustomerAddressError],
                ['updateCustomerAddressMutation', updateCustomerAddressError],
                ['setCustomerAddressOnCartMutation', setCustomerAddressOnCartError]
            ]),
        [createCustomerAddressError, updateCustomerAddressError, setCustomerAddressOnCartError]
    );

    return {
        errors,
        handleCancel,
        handleSubmit,
        hasDefaultShipping,
        initialValues,
        isLoading: getCustomerLoading,
        isSaving,
        isUpdate
    };
};
