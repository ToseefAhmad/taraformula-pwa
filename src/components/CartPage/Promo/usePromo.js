import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

import { GET_PROMO_DATA } from './promo.gql';

export const usePromo = ({ subtotal }) => {
    const [{ cartId }] = useCartContext();
    const [previousSubtotal, setPreviousSubtotal] = useState(null);
    const [promoData, setPromoData] = useState(null);
    const [isLoadingConfig, setIsLoadingConfig] = useState(false);

    const getPromoData = useAwaitQuery(GET_PROMO_DATA);

    const updatePromoData = useCallback(
        async (fetchPolicy = 'cache-first') => {
            if (cartId) {
                setIsLoadingConfig(true);
                const result = await getPromoData({
                    variables: {
                        cartId
                    },
                    fetchPolicy
                });

                if (result && result.data && result.data.getPromoData) {
                    setPromoData(result.data.getPromoData);
                }
                setIsLoadingConfig(false);
            }
        },
        [cartId, getPromoData]
    );

    useEffect(() => {
        if (cartId && !promoData) {
            updatePromoData();
        } else if (cartId && subtotal !== previousSubtotal && !isLoadingConfig) {
            updatePromoData('network-only');
            setPreviousSubtotal(subtotal);
        }
    }, [cartId, isLoadingConfig, previousSubtotal, promoData, subtotal, updatePromoData]);

    const amountToEligible = useMemo(() => {
        if (promoData) {
            const toEligible = promoData.discountStep - subtotal;
            return toEligible < 0 ? 0 : toEligible;
        }
        return 0;
    }, [promoData, subtotal]);

    return {
        amountToEligible,
        isEligible: promoData && promoData.isQualified,
        isFreeGift: promoData && promoData.isFreeGift,
        isPromoActive: promoData && promoData.ruleId
    };
};
