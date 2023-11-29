import { useMutation } from '@apollo/client';
import { useCallback, useMemo } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/AddressForm/guestForm.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useGuestForm = props => {
    const { afterSubmit, onCancel, onSuccess, shippingData, setIsLoading } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { setGuestShippingMutation } = operations;

    const [{ cartId }] = useCartContext();

    const [setGuestShipping, { error, loading }] = useMutation(setGuestShippingMutation, {
        onCompleted: () => {
            onSuccess();
        }
    });

    const { country } = shippingData;
    const { code: countryCode } = country;

    const initialValues = {
        ...shippingData,
        country: countryCode
    };

    // Simple heuristic to indicate form was submitted prior to this render
    const isUpdate = !!shippingData.city;

    const handleSubmit = useCallback(
        async formValues => {
            const { country, email, region, ...address } = formValues;
            isUpdate && setIsLoading(true);
            let regionValue = '';

            if (region) {
                regionValue = region.region_id || region.region;
            }

            try {
                await setGuestShipping({
                    variables: {
                        cartId,
                        email,
                        address: {
                            ...address,
                            // Cleans up the street array when values are null or undefined
                            street: address.street.filter(e => e),
                            // Region_id is used for field select and region is used for field input
                            region: regionValue,
                            country_code: country
                        }
                    }
                });
            } catch {
                return;
            }

            if (afterSubmit) {
                afterSubmit();
            }
            isUpdate && setIsLoading(false);
        },
        [afterSubmit, cartId, setGuestShipping, isUpdate, setIsLoading]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const errors = useMemo(() => new Map([['setGuestShippingMutation', error]]), [error]);

    return {
        errors,
        handleCancel,
        handleSubmit,
        initialValues,
        isSaving: loading,
        isUpdate
    };
};
