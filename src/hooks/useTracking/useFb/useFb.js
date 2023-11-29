/* eslint-disable no-case-declarations */
import { useMutation } from '@apollo/client';
import { useCallback } from 'react';

import { TrackingActions } from '../useTracking';

import { useTrackingContext } from '@app/context/Tracking';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

import { FB_ADD_TO_CART, FB_GET_CART_DETAILS, FB_INITIATE_CHECKOUT, FB_PRODUCT_VIEW, FB_PURCHASE } from './useFb.gql';

const updateFbPixelData = config => {
    if (config.initCode.external_id) {
        fbq('init', config.pixelID, { external_id: config.initCode.external_id });
    } else {
        fbq('init', config.pixelID);
    }

    fbq('set', 'agent', config.agentVersion, config.pixelID);
};

const useFb = () => {
    const [{ cookieConsent }] = useTrackingContext();
    const allowedToTrack = cookieConsent.includes(0) || cookieConsent.includes(3);
    const [{ cartId }] = useCartContext();
    const getCartDetails = useAwaitQuery(FB_GET_CART_DETAILS);

    const [productView] = useMutation(FB_PRODUCT_VIEW);
    const [addToCart] = useMutation(FB_ADD_TO_CART);
    const [initiateCheckout] = useMutation(FB_INITIATE_CHECKOUT);
    const [purchase] = useMutation(FB_PURCHASE);

    const handleEvent = useCallback(
        async action => {
            if (!allowedToTrack || typeof fbq === 'undefined') {
                return;
            }

            try {
                switch (action.type) {
                    case TrackingActions.trackPageView:
                        fbq('track', 'PageView');
                        return;
                    case TrackingActions.trackPurchase:
                        const { data: purchaseData } = await purchase({
                            variables: {
                                orderId: action.payload.orderId
                            }
                        });
                        if (purchaseData && purchaseData.fbPurchase) {
                            const config = purchaseData.fbPurchase;
                            const productIds = action.payload.products.map(product => product.sku);
                            const contents = action.payload.products.map(product => ({
                                id: product.sku,
                                quantity: product.quantity,
                                item_price: product.price
                            }));
                            updateFbPixelData(config);
                            fbq(
                                'track',
                                'Purchase',
                                {
                                    source: config.source,
                                    version: config.magentoVersion,
                                    pluginVersion: config.pluginVersion,
                                    content_type: 'product',
                                    content_ids: JSON.stringify(productIds),
                                    contents: contents,
                                    value: action.payload.revenue,
                                    currency: action.payload.currencyCode
                                },
                                {
                                    eventID: config.eventId
                                }
                            );
                        }
                        return;
                    case TrackingActions.trackProductView:
                        const { data: productViewData } = await productView({
                            variables: {
                                productSku: action.payload.sku
                            }
                        });
                        if (productViewData && productViewData.fbProductView) {
                            const config = productViewData.fbProductView;
                            updateFbPixelData(config);
                            fbq(
                                'track',
                                'ViewContent',
                                {
                                    source: config.source,
                                    version: config.magentoVersion,
                                    pluginVersion: config.pluginVersion,
                                    content_type: 'product',
                                    content_ids: [action.payload.sku],
                                    content_name: action.payload.name,
                                    content_category: action.payload.categories.join(','),
                                    value: action.payload.price,
                                    currency: action.payload.currencyCode
                                },
                                {
                                    eventID: config.eventId
                                }
                            );
                        }
                        return;
                    case TrackingActions.trackOpenCheckout:
                        const { data: initiateCheckoutData } = await initiateCheckout({
                            variables: {
                                cartId
                            }
                        });
                        const result = await getCartDetails({ variables: { cartId } });
                        if (initiateCheckoutData && initiateCheckoutData.fbInitiateCheckout && result && result.data) {
                            const cartDetails = result.data;
                            const config = initiateCheckoutData.fbInitiateCheckout;
                            const contents = cartDetails.cart.items.map(item => ({
                                id: item.product.sku,
                                quantity: item.quantity,
                                item_price: item.prices.price.value
                            }));
                            updateFbPixelData(config);
                            fbq(
                                'track',
                                'InitiateCheckout',
                                {
                                    source: config.source,
                                    version: config.magentoVersion,
                                    pluginVersion: config.pluginVersion,
                                    content_type: 'product',
                                    content_ids: cartDetails.cart.items.map(item => item.product.sku),
                                    num_items: cartDetails.cart.items.length,
                                    contents: contents,
                                    value: cartDetails.cart.prices.subtotal_including_tax.value,
                                    currency: cartDetails.cart.prices.subtotal_including_tax.currency
                                },
                                {
                                    eventID: config.eventId
                                }
                            );
                        }
                        return;
                    case TrackingActions.trackAddToCart:
                        const product = action.payload.products[0];
                        const { data: addToCartData } = await addToCart({
                            variables: {
                                productSku: product.sku
                            }
                        });
                        if (addToCartData && addToCartData.fbAddToCart) {
                            const config = addToCartData.fbAddToCart.config;
                            updateFbPixelData(config);
                            fbq(
                                'track',
                                'AddToCart',
                                {
                                    source: config.source,
                                    version: config.magentoVersion,
                                    pluginVersion: config.pluginVersion,
                                    content_type: 'product',
                                    currency: action.payload.currencyCode,
                                    content_ids: [product.sku],
                                    content_name: product.name,
                                    content_category: addToCartData.fbAddToCart.categories,
                                    value: product.price
                                },
                                {
                                    eventID: config.eventId
                                }
                            );
                        }
                        return;
                    case TrackingActions.trackUserRegister:
                        fbq('track', 'CompleteRegistration');
                        return;
                }
            } catch (e) {
                // Fail silently
            }
        },
        [addToCart, allowedToTrack, getCartDetails, cartId, initiateCheckout, productView, purchase]
    );

    return {
        handleEvent
    };
};

export default useFb;
