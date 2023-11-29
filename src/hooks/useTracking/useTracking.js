import { useCallback } from 'react';

import { getBreadcrumbCategoryId } from '@app/components/overrides/ProductFullDetail/useProductFullDetail';
import useFb from '@app/hooks/useTracking/useFb';
import useGtm from '@app/hooks/useTracking/useGtm';

export const TrackingActions = {
    trackAddToCart: 'TRACKING/ADD_TO_CART',
    trackAddToWishlist: 'TRACKING/ADD_TO_WISHLIST',
    trackUserRegister: 'TRACKING/USER_REGISTER',
    trackUserLogin: 'TRACKING/USER_LOGIN',
    trackUserInitialized: 'TRACKING/USER_INITIALIZED',
    trackUserData: 'TRACKING/USER_DATA',
    trackOpenCheckout: 'TRACKING/OPEN_CHECKOUT',
    trackMyAccount: 'TRACKING/MY_ACCOUNT',
    trackCookieConsent: 'TRACKING/COOKIE_CONSENT',
    trackNewsletterSubscribe: 'TRACKING/NEWSLETTER_SUBSCRIBE',
    trackPurchase: 'TRACKING/PURCHASE',
    trackProductView: 'TRACKING/PRODUCT_VIEW',
    trackPageView: 'TRACKING/PAGE_VIEW',
    trackRemoveFromCart: 'TRACKING/REMOVE_FROM_CART',
    trackProductImpression: 'TRACKING/PRODUCT_IMPRESSION',
    trackProductDetails: 'TRACKING/PRODUCT_DETAILS',
    trackProductClick: 'TRACKING/PRODUCT_CLICK',
    trackCheckoutStep: 'TRACKING/CHECKOUT_STEP'
};

const useTracking = () => {
    const { handleEvent: handleGtmEvent } = useGtm();
    const { handleEvent: handleFbEvent } = useFb();

    const handleEvent = useCallback(
        (type, payload) => {
            const action = { type, payload };
            handleGtmEvent(action);
            handleFbEvent(action);
        },
        [handleGtmEvent, handleFbEvent]
    );
    const trackAddToCart = useCallback(
        payload => {
            handleEvent(TrackingActions.trackAddToCart, payload);
        },
        [handleEvent]
    );
    const trackUserRegister = useCallback(
        payload => {
            handleEvent(TrackingActions.trackUserRegister, payload);
        },
        [handleEvent]
    );
    const trackUserLogin = useCallback(
        payload => {
            handleEvent(TrackingActions.trackUserLogin, payload);
        },
        [handleEvent]
    );
    const trackUserInitialized = useCallback(
        payload => {
            handleEvent(TrackingActions.trackUserInitialized, payload);
        },
        [handleEvent]
    );
    const trackUserData = useCallback(
        payload => {
            handleEvent(TrackingActions.trackUserData, payload);
        },
        [handleEvent]
    );
    const trackOpenCheckout = useCallback(
        payload => {
            handleEvent(TrackingActions.trackOpenCheckout, payload);
        },
        [handleEvent]
    );
    const trackMyAccount = useCallback(
        payload => {
            handleEvent(TrackingActions.trackMyAccount, payload);
        },
        [handleEvent]
    );
    const trackCookieConsent = useCallback(
        payload => {
            handleEvent(TrackingActions.trackCookieConsent, payload);
        },
        [handleEvent]
    );
    const trackNewsletterSubscribe = useCallback(
        payload => {
            handleEvent(TrackingActions.trackNewsletterSubscribe, payload);
        },
        [handleEvent]
    );
    const trackPurchase = useCallback(
        payload => {
            handleEvent(TrackingActions.trackPurchase, payload);
        },
        [handleEvent]
    );
    const trackPageView = useCallback(
        payload => {
            handleEvent(TrackingActions.trackPageView, payload);
        },
        [handleEvent]
    );
    const trackProductView = useCallback(
        payload => {
            handleEvent(TrackingActions.trackProductView, payload);
        },
        [handleEvent]
    );

    const trackRemoveFromCart = useCallback(
        payload => {
            handleEvent(TrackingActions.trackRemoveFromCart, payload);
        },
        [handleEvent]
    );

    const trackProductDetails = useCallback(
        payload => {
            handleEvent(TrackingActions.trackProductDetails, payload);
        },
        [handleEvent]
    );

    const trackProductImpression = useCallback(
        payload => {
            handleEvent(TrackingActions.trackProductImpression, payload);
        },
        [handleEvent]
    );

    const trackProductClick = useCallback(
        payload => {
            handleEvent(TrackingActions.trackProductClick, payload);
        },
        [handleEvent]
    );

    const getProductCategories = useCallback(categories => {
        if (!categories || !categories.length) {
            return '';
        }
        const categoryId = getBreadcrumbCategoryId(categories);
        const category = categories.find(cat => cat.id === categoryId);
        if (category) {
            return `${(category.breadcrumbs &&
                category.breadcrumbs.map(breadcrumb => breadcrumb.category_name).join('/') + '/') ||
                ''}${category.name}`;
        }
    }, []);

    return {
        trackAddToCart,
        trackProductDetails,
        trackUserRegister,
        trackUserLogin,
        trackUserInitialized,
        trackUserData,
        trackOpenCheckout,
        trackMyAccount,
        trackCookieConsent,
        trackNewsletterSubscribe,
        trackPurchase,
        trackPageView,
        trackProductView,
        getProductCategories,
        trackRemoveFromCart,
        trackProductClick,
        trackProductImpression
    };
};

export default useTracking;
