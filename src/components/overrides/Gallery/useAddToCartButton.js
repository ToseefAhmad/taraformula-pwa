import { useMutation } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ToastType, useToasts } from '@app/hooks/useToasts';
import useTracking from '@app/hooks/useTracking/useTracking';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import operations from '@magento/peregrine/lib/talons/Gallery/addToCart.gql';
import { useCartTrigger } from '@magento/peregrine/lib/talons/Header/useCartTrigger';
import { GET_ITEM_COUNT_QUERY } from '@magento/venia-ui/lib/components/Header/cartTrigger.gql';

/**
 * @param {String} props.item.uid - uid of item
 * @param {String} props.item.name - name of item
 * @param {String} props.item.stock_status - stock status of item
 * @param {String} props.item.type_id - product type
 * @param {String} props.item.url_key - item url key
 * @param {String} props.item.sku - item sku
 *
 * @returns {
 *      handleAddToCart: Function,
 *      isDisabled: Boolean,
 *      isInStock: Boolean
 * }
 *
 */
const UNSUPPORTED_PRODUCT_TYPES = ['virtual', 'bundle', 'grouped', 'downloadable'];

export const useAddToCartButton = props => {
    const { item } = props;

    const [, { addToast }] = useToasts();
    const { getProductCategories, trackAddToCart } = useTracking();

    const [isLoading, setIsLoading] = useState(false);

    const productType = item.type_id;

    /**
     * If this product is configurable - display ADD TO CART button
     * If configurable product child will be all OUT OF STOCK, then product won't be displayed on FE
     *
     * @type {boolean}
     */
    const isInStock = productType === 'configurable' || (item.stock_status === 'IN_STOCK' && item.max_qty > 0);

    const isUnsupportedProductType = UNSUPPORTED_PRODUCT_TYPES.includes(productType);
    const isDisabled = isLoading || !isInStock || isUnsupportedProductType;

    const history = useHistory();

    const [{ cartId }] = useCartContext();

    const [
        ,
        {
            actions: { setCartPopUp }
        }
    ] = useAppContext();

    const { setMiniCartIsOpen } = useCartTrigger({
        queries: {
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        }
    });

    const [addToCart] = useMutation(operations.ADD_ITEM);

    useEffect(() => {
        setMiniCartIsOpen;
    }, [setMiniCartIsOpen]);

    const handleAddToCart = useCallback(async () => {
        try {
            if (productType === 'simple') {
                setIsLoading(true);

                await addToCart({
                    variables: {
                        cartId,
                        cartItem: {
                            quantity: 1,
                            entered_options: [
                                {
                                    uid: item.uid,
                                    value: item.name
                                }
                            ],
                            sku: item.sku
                        }
                    }
                });

                trackAddToCart({
                    currencyCode: item.price_range.maximum_price.final_price.currency,
                    products: [
                        {
                            quantity: 1,
                            sku: item.sku,
                            name: item.name,
                            price: item.price_range.maximum_price.final_price.value,
                            category: getProductCategories(item.categories)
                        }
                    ]
                });
                // Trigger mini-cart pop-up
                setCartPopUp({ cartItem: { ...item, ...{ quantity: 1 } } });

                setIsLoading(false);
            } else if (productType === 'configurable') {
                history.replace(`/${item.url_key}`);
            } else {
                console.warn('Unsupported product type unable to handle.');
            }
        } catch (error) {
            addToast({
                type: ToastType.ERROR,
                message: error.message,
                timeout: false
            });
        }
    }, [productType, addToCart, cartId, item, trackAddToCart, setCartPopUp, history, addToast, getProductCategories]);

    return {
        handleAddToCart,
        isDisabled,
        isInStock,
        isLoading
    };
};
