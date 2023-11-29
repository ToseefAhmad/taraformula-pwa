import { useCallback } from 'react';

import { useTrackingContext } from '@app/context/Tracking';
import { TrackingActions } from '@app/hooks/useTracking/useTracking';

const useGtm = () => {
    const [{ cookieConsent }] = useTrackingContext();
    const allowedToTrack = cookieConsent.includes(0) || cookieConsent.includes(3);

    const handleEvent = useCallback(
        action => {
            /**
             * If tracking is disabled or customer selected to disable Analytics cookies disable pushing events
             * except for cookie consent as we dont have selection set yet
             */
            if (
                typeof dataLayer === 'undefined' ||
                (!allowedToTrack && action.type !== TrackingActions.trackCookieConsent)
            ) {
                return;
            }

            switch (action.type) {
                case TrackingActions.trackPageView:
                    dataLayer.push({
                        event: 'virtualPageView',
                        pageUrl: globalThis.location.href,
                        title: globalThis.document.title
                    });
                    return;
                case TrackingActions.trackAddToCart:
                    dataLayer.push({ ecommerce: null });
                    dataLayer.push({
                        event: 'add_to_cart',
                        ecommerce: {
                            currency: action.payload.currencyCode,
                            items: action.payload.products.map(product => ({
                                item_id: product.sku,
                                item_name: product.name,
                                price: product.price,
                                quantity: product.quantity,
                                item_category: product.category
                            }))
                        }
                    });
                    return;
                case TrackingActions.trackRemoveFromCart:
                    dataLayer.push({ ecommerce: null });
                    dataLayer.push({
                        event: 'remove_from_cart',
                        ecommerce: {
                            items: action.payload.products.map(product => ({
                                item_id: product.sku,
                                item_name: product.name,
                                price: product.price,
                                quantity: product.quantity,
                                item_category: product.category
                            }))
                        }
                    });
                    return;
                case TrackingActions.trackProductImpression:
                    dataLayer.push({ ecommerce: null });
                    dataLayer.push({
                        event: 'view_item_list',
                        ecommerce: {
                            item_list_name: action.payload.list,
                            items: action.payload.products.map(product => ({
                                item_id: product.sku,
                                item_name: product.name,
                                price: product.price,
                                item_category: product.category,
                                index: product.position
                            }))
                        }
                    });
                    return;
                case TrackingActions.trackProductDetails:
                    dataLayer.push({ ecommerce: null });
                    dataLayer.push({
                        event: 'view_item',
                        ecommerce: {
                            currency: action.payload.currencyCode,
                            items: [
                                {
                                    item_id: action.payload.product.sku,
                                    item_name: action.payload.product.name,
                                    price: action.payload.product.price,
                                    item_category: action.payload.product.category
                                }
                            ]
                        }
                    });
                    return;
                case TrackingActions.trackProductClick:
                    dataLayer.push({ ecommerce: null });
                    dataLayer.push({
                        event: 'select_item',
                        ecommerce: {
                            item_list_name: action.payload.list,
                            items: [
                                {
                                    item_id: action.payload.product.sku,
                                    item_name: action.payload.product.name,
                                    price: action.payload.product.price,
                                    item_category: action.payload.product.category
                                }
                            ]
                        }
                    });
                    return;
                case TrackingActions.trackMyAccount:
                    dataLayer.push({
                        event: 'myAccount'
                    });
                    return;
                case TrackingActions.trackUserRegister:
                    dataLayer.push({
                        event: 'userRegister',
                        user_id: action.payload.id,
                        user_email: action.payload.email
                    });
                    return;
                case TrackingActions.trackUserLogin:
                    dataLayer.push({
                        event: `login_${action.payload.type}`
                    });
                    return;
                case TrackingActions.trackUserInitialized:
                    dataLayer.push({
                        event: 'userInitialized',
                        user_id: action.payload.id,
                        user_email: action.payload.email
                    });
                    return;
                case TrackingActions.trackUserData:
                    dataLayer.push({
                        event: 'userData',
                        userData: {
                            email: action.payload.email,
                            phone_number: action.payload.telephone,
                            address: {
                                first_name: action.payload.firstname,
                                last_name: action.payload.lastname,
                                street: action.payload.street.join(', '),
                                city: action.payload.city,
                                region: action.payload.region,
                                country: action.payload.country_code,
                                postal_code: action.payload.postcode
                            }
                        }
                    });
                    return;
                case TrackingActions.trackCookieConsent:
                    dataLayer.push({
                        event: `cookieConsent_${action.payload.type}`
                    });
                    return;
                case TrackingActions.trackNewsletterSubscribe:
                    dataLayer.push({
                        event: 'newsletterSubscribe',
                        newsletterSubscribe: {
                            email: action.payload.email
                        }
                    });
                    return;
                case TrackingActions.trackOpenCheckout:
                    dataLayer.push({ ecommerce: null });
                    dataLayer.push({
                        event: 'begin_checkout',
                        currency: action.payload.currencyCode,
                        ecommerce: {
                            items: action.payload.products.map(product => ({
                                item_id: product.sku,
                                item_name: product.name,
                                price: product.price,
                                quantity: product.quantity
                            }))
                        }
                    });
                    return;
                case TrackingActions.trackPurchase:
                    dataLayer.push({ ecommerce: null });
                    dataLayer.push({
                        event: 'purchase',
                        currency: action.payload.currencyCode,
                        ecommerce: {
                            transaction_id: action.payload.orderId,
                            value: action.payload.revenue,
                            coupon: action.payload.coupon,
                            tax: action.payload.tax,
                            shipping: action.payload.shipping,

                            items: action.payload.products.map(product => ({
                                item_id: product.sku,
                                item_name: product.name,
                                price: product.price,
                                quantity: product.quantity,
                                item_category: product.category
                            }))
                        }
                    });
                    return;
                default:
            }
        },
        [allowedToTrack]
    );

    return {
        handleEvent
    };
};

export default useGtm;
