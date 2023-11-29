import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { MOCKED_ADDRESS } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingForm';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/shippingInformation.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useShippingInformation = props => {
    const { onSave, toggleActiveContent } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

    const [hasUpdate, setHasUpdate] = useState(false);
    const hasLoadedData = useRef(false);

    const { setDefaultAddressOnCartMutation, getDefaultShippingQuery, getShippingInformationQuery } = operations;

    const { data: shippingInformationData, loading: getShippingInformationLoading } = useQuery(
        getShippingInformationQuery,
        {
            skip: !cartId,
            variables: {
                cartId
            }
        }
    );

    const { data: defaultShippingData, loading: getDefaultShippingLoading } = useQuery(getDefaultShippingQuery, {
        skip: !isSignedIn
    });

    const [setDefaultAddressOnCart, { loading: setDefaultAddressLoading }] = useMutation(
        setDefaultAddressOnCartMutation
    );

    const isLoading = getShippingInformationLoading || getDefaultShippingLoading || setDefaultAddressLoading;

    const shippingData = useMemo(() => {
        let filteredData;
        if (shippingInformationData) {
            const { cart } = shippingInformationData;
            // Hotfix for error in order success page, where it can't find email from cart in below line because
            // Cart is null. Theoretically, it shouldn't even go here in success page, so the problem lies somewhere a lot deeper.
            if (!cart) {
                return;
            }
            const { email, shipping_addresses: shippingAddresses } = cart;
            if (shippingAddresses.length) {
                const primaryAddress = { ...shippingAddresses[0] };
                for (const field in MOCKED_ADDRESS) {
                    if (primaryAddress[field] === MOCKED_ADDRESS[field]) {
                        primaryAddress[field] = '';
                    }

                    if (field === 'street' && primaryAddress[field][0] === MOCKED_ADDRESS[field][0]) {
                        primaryAddress[field] = [''];
                    }
                }

                const { region_id, label: region, code: region_code } = primaryAddress.region;

                primaryAddress.region = {
                    region_code,
                    region_id,
                    region
                };

                filteredData = {
                    email,
                    ...primaryAddress
                };
            }
        }

        return filteredData;
    }, [shippingInformationData]);

    // Simple heuristic to check shipping data existed prior to this render.
    // On first submission, when we have data, we should tell the checkout page
    // So that we set the next step correctly.
    const doneEditing = !!shippingData && !!shippingData.city;

    useEffect(() => {
        if (doneEditing) {
            onSave();
        }
    }, [doneEditing, onSave]);

    useEffect(() => {
        let updateTimer;
        if (shippingData !== undefined) {
            if (hasLoadedData.current) {
                setHasUpdate(true);
                updateTimer = setTimeout(() => {
                    setHasUpdate(false);
                }, 2000);
            } else {
                hasLoadedData.current = true;
            }
        }

        return () => {
            if (updateTimer) {
                clearTimeout(updateTimer);
            }
        };
    }, [hasLoadedData, shippingData]);

    useEffect(() => {
        if (shippingInformationData && !doneEditing && cartId && defaultShippingData) {
            const { customer } = defaultShippingData;
            const { default_shipping: defaultAddressId } = customer;
            if (defaultAddressId) {
                setDefaultAddressOnCart({
                    variables: {
                        cartId,
                        addressId: parseInt(defaultAddressId)
                    }
                });
            }
        }
    }, [cartId, doneEditing, defaultShippingData, setDefaultAddressOnCart, shippingInformationData]);

    const handleEditShipping = useCallback(() => {
        if (isSignedIn) {
            toggleActiveContent();
        } else {
            toggleDrawer('shippingInformation.edit');
        }
    }, [isSignedIn, toggleActiveContent, toggleDrawer]);

    return {
        doneEditing,
        handleEditShipping,
        hasUpdate,
        isLoading,
        isSignedIn,
        shippingData
    };
};
