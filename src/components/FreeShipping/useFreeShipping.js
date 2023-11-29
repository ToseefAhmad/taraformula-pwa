import { useEffect, useMemo, useState } from 'react';

import { useStoreConfigContext } from '@app/context/StoreConfigContext/useStoreConfigContext';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';

export const useFreeShipping = () => {
    const [isEligible, setIsEligible] = useState(false);
    const [amountToEligible, setAmountToEligible] = useState(null);

    const { flatData: priceSummary } = usePriceSummary();
    const currency = priceSummary.subtotal ? priceSummary.subtotal.currency : null;

    const { storeConfigData } = useStoreConfigContext();
    const storeConfig = storeConfigData.storeConfig;

    const isFreeShippingEnabled = useMemo(() => {
        if (storeConfig) {
            return storeConfig.free_shipping_enabled || false;
        }
    }, [storeConfig]);

    const isTaxIncluded = useMemo(() => {
        if (storeConfig) {
            return storeConfig.free_shipping_tax_including || true;
        }
    }, [storeConfig]);

    const freeShippingThreshold = useMemo(() => {
        if (storeConfig) {
            return storeConfig.free_shipping_threshold || 0;
        }
    }, [storeConfig]);

    const subtotal = useMemo(() => {
        if (!priceSummary.subtotal) {
            return 0;
        }
        const discounts = priceSummary.discounts
            ? priceSummary.discounts.map(discount => {
                  return discount.amount.value;
              })
            : [];
        const discountAmount = discounts.reduce((sum, discount) => sum + discount, 0);
        if (isTaxIncluded) {
            const taxes = priceSummary.taxes
                ? priceSummary.taxes.map(tax => {
                      return tax.amount.value;
                  })
                : [];
            const taxAmount = taxes.reduce((sum, tax) => sum + tax, 0);
            return priceSummary.subtotal.value - discountAmount + taxAmount;
        } else {
            return priceSummary.subtotal.value - discountAmount;
        }
    }, [isTaxIncluded, priceSummary]);

    useEffect(() => {
        const delta = freeShippingThreshold - subtotal;
        setIsEligible(delta <= 0);
        setAmountToEligible(delta <= 0 ? 0 : delta);
    }, [freeShippingThreshold, isTaxIncluded, subtotal]);

    return {
        amountToEligible,
        currency,
        isFreeShippingEnabled,
        isEligible
    };
};
