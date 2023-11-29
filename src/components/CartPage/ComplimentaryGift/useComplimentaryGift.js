import { useMutation } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';

import { useToasts, ToastType } from '@app/hooks/useToasts';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';

import {
    ADD_COMPLIMENTARY_GIFT,
    REMOVE_COMPLIMENTARY_GIFT,
    GET_COMPLIMENTARY_GIFT_DATA
} from './complimentaryGift.gql';

export const useComplimentaryGift = setIsCartUpdating => {
    // Subtotal
    const talonProps = usePriceSummary();
    const { flatData } = talonProps;
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        if (flatData && flatData.total) {
            setSubtotal(flatData.total.value);
        }
    }, [flatData]);

    // CartId
    const [{ cartId }] = useCartContext();

    // Toast
    const [, { addToast }] = useToasts();

    // State
    const [showModal, setShowModal] = useState(false);
    const [complimentaryGiftModalSeen, setComplimentaryGiftModalSeen] = useState(false);
    const [complimentaryGiftData, setComplimentaryGiftData] = useState(null);
    const [previousSubtotal, setPreviousSubtotal] = useState(null);
    const [ruleId, setRuleId] = useState(null);
    const [isLoadingConfig, setIsLoadingConfig] = useState(false);

    // Queries
    const getComplimentaryGiftData = useAwaitQuery(GET_COMPLIMENTARY_GIFT_DATA);
    const [addFreeGift, { addFreeGiftLoading }] = useMutation(ADD_COMPLIMENTARY_GIFT);
    const [removeFreeGift] = useMutation(REMOVE_COMPLIMENTARY_GIFT);

    // Callbacks
    const updateComplimentaryGiftData = useCallback(
        async (fetchPolicy = 'cache-first') => {
            if (cartId) {
                setIsLoadingConfig(true);
                const result = await getComplimentaryGiftData({
                    variables: {
                        cartId
                    },
                    fetchPolicy
                });
                if (result && result.data && result.data.getComplimentaryGiftData.complimentaryGiftProducts) {
                    setRuleId(result.data.getComplimentaryGiftData.ruleId);
                    setComplimentaryGiftData(result.data.getComplimentaryGiftData.complimentaryGiftProducts);
                    if (!result.data.getComplimentaryGiftData.isRuleActive) {
                        await removeFreeGift({
                            variables: {
                                cartId
                            }
                        });
                    } else {
                        if (
                            subtotal &&
                            result.data.getComplimentaryGiftData.discountStep !== null &&
                            result.data.getComplimentaryGiftData.discountStep <= subtotal &&
                            result.data.getComplimentaryGiftData.selectedComplimentaryGiftItems === null
                        ) {
                            setShowModal(true);
                        }
                    }
                }
                setIsLoadingConfig(false);
            }
        },
        [cartId, getComplimentaryGiftData, removeFreeGift, subtotal]
    );

    const handleAddComplimentaryGift = useCallback(
        async item => {
            setShowModal(false);
            setIsCartUpdating(true);
            const response = await addFreeGift({
                variables: {
                    cartId,
                    item: {
                        ruleId,
                        productId: item.id
                    }
                }
            });

            setIsCartUpdating(false);
            if (response.data.addComplimentaryGift.success) {
                // Do nothing for now
            } else {
                addToast({
                    type: ToastType.ERROR,
                    message: 'Failed to add free gift to cart'
                });
            }
        },
        [addToast, cartId, addFreeGift, ruleId, setShowModal, setIsCartUpdating]
    );

    // Effects
    useEffect(() => {
        if (complimentaryGiftModalSeen) {
            return;
        }
        if (cartId && !complimentaryGiftData) {
            updateComplimentaryGiftData();
        } else if (cartId && subtotal && subtotal !== previousSubtotal && !isLoadingConfig) {
            // Reload gift data when subtotals change
            updateComplimentaryGiftData('network-only');
            setPreviousSubtotal(subtotal);
        }
    }, [
        cartId,
        updateComplimentaryGiftData,
        complimentaryGiftData,
        previousSubtotal,
        subtotal,
        complimentaryGiftModalSeen,
        isLoadingConfig
    ]);

    return {
        cartId: cartId,
        addToast: addToast,
        showModal: showModal,
        setShowModal: setShowModal,
        complimentaryGiftData: complimentaryGiftData,
        setComplimentaryGiftModalSeen: setComplimentaryGiftModalSeen,
        addFreeGift: addFreeGift,
        addFreeGiftLoading: addFreeGiftLoading,
        handleAddComplimentaryGift
    };
};
