import { useApolloClient, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useIntl } from 'react-intl';

import { GET_ALLOWED_COUNTRIES_QUERY } from '@app/components/overrides/Country/allowedCountries.gql';
import { useCountry } from '@app/components/overrides/Country/useCountry';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import useTracking from '@app/hooks/useTracking/useTracking';
import operations from '@app/overrides/peregrine/talons/CheckoutPage/checkoutPage.gql.js';
import { isValidPhoneNumberForCountry } from '@app/util/formValidators';
import { getCartItemSimpleSku } from '@app/util/getCartItemSimpleSku';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';
import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';
import { useShippingInformation } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useShippingInformation';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

export const CHECKOUT_STEP = {
    SHIPPING_ADDRESS: 1,
    SHIPPING_METHOD: 2,
    PAYMENT: 3,
    REVIEW: 4,
    SUCCESS: 5
};

const storage = new BrowserPersistence();

/**
 *
 * @returns {{setPaymentInformationDone: ((function(): void)|*), orderNumber: boolean, availablePaymentMethods: ({merge(*, *): *}|{merge: function(*, *): *}|{merge: function(*, *): *}|*|null), scrollShippingInformationIntoView: ((function(): void)|*), scrollShippingMethodIntoView: ((function(): void)|*), error: unknown, placeOrderData: any, isPlacingOrder: boolean, toggleSignInContent: ((function(): void)|*), isDefaultShippingValid: boolean, resetReviewOrderButtonClicked: ((function(): void)|*), isFatoorahRedirect: boolean, isRedirecting: boolean, checkoutStep: number, isUpdating: boolean, setCheckoutStep: (value: (((prevState: number) => number) | number)) => void, shippingInformationRef: React.MutableRefObject<undefined>, isGuestCheckout: boolean, setIsUpdating: (value: (((prevState: boolean) => boolean) | boolean)) => void, cardInfo: {cardType: (any|null), cardLastFour: (any|null)}, toggleAddressBookContent: ((function(): void)|*), setShippingMethodDone: ((function(): void)|*), reviewOrderButtonClicked: boolean, placeOrderLoading: boolean, setShippingInformationDone: ((function(): void)|*), handleReviewOrder: ((function(): void)|*), orderDetailsLoading: false | boolean, handlePlaceOrder: ((function(): Promise<void>)|*), isLoading: unknown, activeContent: string, hasError: boolean, cartItems: unknown, isCartEmpty: boolean, orderDetailsData: any, shippingMethodRef: React.MutableRefObject<undefined>, customer: any}}
 */
export const useCheckoutPage = () => {
    const {
        createCartMutation,
        getCheckoutDetailsQuery,
        getCustomerQuery,
        getOrderDetailsQuery,
        placeOrderMutation,
        getNewsletterConsentQuery,
        saveNewsletterConsentMutation
    } = operations;
    const { location } = globalThis;
    const [reviewOrderButtonClicked, setReviewOrderButtonClicked] = useState(false);
    const [shouldRefetchPrices, setShouldRefetchPrices] = useState(false);

    const [orderNumber, setOrderNumber] = useState(false);
    const [isAfterpayOrderPlaced, setIsAfterpayOrderPlaced] = useState(false);
    const [isFatoorahRedirect, setIsFatoorahRedirect] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const initialized = useRef(false);
    const shippingInformationRef = useRef();
    const shippingMethodRef = useRef();
    const { formatMessage } = useIntl();

    const apolloClient = useApolloClient();
    const [isUpdating, setIsUpdating] = useState(false);
    const [activeContent, setActiveContent] = useState('checkout');
    const [checkoutStep, setCheckoutStep] = useState(CHECKOUT_STEP.SHIPPING_ADDRESS);
    const [{ isSignedIn }] = useUserContext();
    const [{ cartId }, { createCart, removeCart }] = useCartContext();
    const { trackOpenCheckout } = useTracking();
    const [isDefaultShippingValid, setIsDefaultShippingValid] = useState(true);
    const [isShippingPhoneNumberValid, setIsShippingPhoneNumberValid] = useState(true);
    const [, { addToast }] = useToasts();

    const [fetchCartId] = useMutation(createCartMutation);
    const [placeOrder, { data: placeOrderData, error: placeOrderError, loading: placeOrderLoading }] = useMutation(
        placeOrderMutation
    );

    const [getOrderDetails, { data: orderDetailsData, loading: orderDetailsLoading }] = useLazyQuery(
        getOrderDetailsQuery,
        {
            // We use this query to fetch details _just_ before submission, so we
            // Want to make sure it is fresh. We also don't want to cache this data
            // Because it may contain PII.
            fetchPolicy: 'no-cache'
        }
    );

    const { data: customerData, loading: customerLoading } = useQuery(getCustomerQuery, { skip: !isSignedIn });

    const { data: checkoutData, networkStatus: checkoutQueryNetworkStatus } = useQuery(getCheckoutDetailsQuery, {
        /**
         * Skip fetching checkout details if the `cartId`
         * is a falsy value.
         */
        skip: !cartId,
        notifyOnNetworkStatusChange: true,
        variables: {
            cartId
        }
    });

    const { data: newsletterConsent } = useQuery(getNewsletterConsentQuery, {
        variables: { masked_cart_id: cartId },
        fetchPolicy: 'cache-and-network'
    });

    const cartItems = useMemo(() => {
        return (checkoutData && checkoutData.cart && checkoutData.cart.items) || [];
    }, [checkoutData]);

    // Initialize checkout state
    useEffect(() => {
        if (!initialized.current && checkoutData) {
            if (cartItems.length) {
                trackOpenCheckout({
                    stepNum: 1,
                    currencyCode: cartItems[0].prices.price.currency,
                    products: cartItems.map(item => ({
                        sku: getCartItemSimpleSku(item),
                        name: item.product.name,
                        price: item.prices.price.value,
                        quantity: item.quantity
                    }))
                });
            }
            initialized.current = true;
        }
    }, [cartItems, trackOpenCheckout, checkoutData]);

    useEffect(() => {
        if (getSearchParam('paymentFailed', location)) {
            addToast({
                customId: 'checkoutPage.paymentFailed',
                type: ToastType.ERROR,
                message: formatMessage({
                    id: 'checkoutPage.paymentFailed',
                    defaultMessage:
                        'Your bank declined the transaction. Please check payment details or try again using a different payment method'
                }),
                timeout: false
            });
        }
    }, [addToast, formatMessage, location]);

    /**
     * For more info about network statues check this out
     *
     * https://www.apollographql.com/docs/react/data/queries/#inspecting-loading-states
     */
    const isLoading = useMemo(() => {
        const checkoutQueryInFlight = checkoutQueryNetworkStatus ? checkoutQueryNetworkStatus < 7 : true;

        return checkoutQueryInFlight || customerLoading;
    }, [checkoutQueryNetworkStatus, customerLoading]);

    const customer = customerData && customerData.customer;

    const toggleAddressBookContent = useCallback(() => {
        setActiveContent(currentlyActive => (currentlyActive === 'checkout' ? 'addressBook' : 'checkout'));
    }, []);
    const toggleSignInContent = useCallback(() => {
        setActiveContent(currentlyActive => (currentlyActive === 'checkout' ? 'signIn' : 'checkout'));
    }, []);

    const checkoutError = useMemo(() => {
        if (placeOrderError) {
            return new CheckoutError(placeOrderError);
        }
    }, [placeOrderError]);

    const handleReviewOrder = useCallback(() => {
        setReviewOrderButtonClicked(true);
    }, []);

    const resetReviewOrderButtonClicked = useCallback(() => {
        setReviewOrderButtonClicked(false);
    }, []);

    const scrollShippingInformationIntoView = useCallback(() => {
        if (shippingInformationRef.current) {
            shippingInformationRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [shippingInformationRef]);

    const setShippingInformationDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_ADDRESS) {
            setCheckoutStep(CHECKOUT_STEP.SHIPPING_METHOD);
        }
    }, [checkoutStep]);

    const scrollShippingMethodIntoView = useCallback(() => {
        if (shippingMethodRef.current) {
            shippingMethodRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [shippingMethodRef]);

    const setShippingMethodDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_METHOD) {
            setCheckoutStep(CHECKOUT_STEP.PAYMENT);
        }
    }, [checkoutStep]);

    const setShippingMethodError = useCallback(() => {
        if (checkoutStep !== CHECKOUT_STEP.SHIPPING_METHOD) {
            setCheckoutStep(CHECKOUT_STEP.SHIPPING_METHOD);
        }
    }, [checkoutStep]);

    const setPaymentInformationDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.PAYMENT) {
            globalThis.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
            setCheckoutStep(CHECKOUT_STEP.REVIEW);
            setShowLoader(false);
        }
    }, [checkoutStep]);

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const handlePlaceOrder = useCallback(async () => {
        // Fetch order details and then use an effect to actually place the
        // Order. If/when Apollo returns promises for invokers from useLazyQuery
        // We can just await this function and then perform the rest of order
        // Placement.
        await getOrderDetails({
            variables: {
                cartId
            }
        });

        setIsPlacingOrder(true);
        setShowLoader(true);
    }, [cartId, getOrderDetails]);

    // Go back to checkout if shopper logs in
    useEffect(() => {
        if (isSignedIn) {
            setActiveContent('checkout');
        }
    }, [isSignedIn]);

    // Detecting Redirect needed
    useEffect(() => {
        if (placeOrderData && orderDetailsData) {
            const afterpayRedirect =
                orderDetailsData.cart && orderDetailsData.cart.selected_payment_method.title === 'Afterpay';
            setIsAfterpayOrderPlaced(afterpayRedirect);
            setIsRedirecting(afterpayRedirect);

            const fatoorahRedirect = (placeOrderData && placeOrderData.placeOrder.order.myFatoorah) || false;
            setIsFatoorahRedirect(fatoorahRedirect);
            if (
                !fatoorahRedirect &&
                !(
                    placeOrderData &&
                    placeOrderData.placeOrder &&
                    placeOrderData.placeOrder.order &&
                    placeOrderData.placeOrder.order.redirect_url
                )
            ) {
                setOrderNumber((placeOrderData && placeOrderData.placeOrder.order.order_number) || null);
            }
        }
    }, [orderDetailsData, placeOrderData, setOrderNumber, setIsFatoorahRedirect]);

    useEffect(() => {
        const placeOrderAndCleanup = async () => {
            try {
                const result = await placeOrder({
                    variables: {
                        cartId
                    }
                });

                storage.setItem('checkout_order_data', orderDetailsData);
                storage.setItem('checkout_order_number', result.data && result.data.placeOrder.order.order_number);

                setCheckoutStep(CHECKOUT_STEP.SUCCESS);

                // Cleanup stale cart and customer info.
                await removeCart();
                await clearCartDataFromCache(apolloClient);

                await createCart({
                    fetchCartId
                });

                if (
                    result.data &&
                    result.data.placeOrder &&
                    result.data.placeOrder.order &&
                    result.data.placeOrder.order.redirect_url
                ) {
                    setIsRedirecting(true);
                    !!location && location.replace(result.data.placeOrder.order.redirect_url);
                }
            } catch (err) {
                console.error('An error occurred during when placing the order', err);
                setReviewOrderButtonClicked(false);
                setCheckoutStep(CHECKOUT_STEP.PAYMENT);
            }

            setShowLoader(false);
        };

        if (orderDetailsData && isPlacingOrder) {
            setIsPlacingOrder(false);
            placeOrderAndCleanup();
        }
    }, [
        apolloClient,
        cartId,
        createCart,
        fetchCartId,
        orderDetailsData,
        placeOrder,
        removeCart,
        isPlacingOrder,
        placeOrderData,
        location
    ]);

    const paymentInfo = (placeOrderData && placeOrderData.placeOrder.order.payment) || null;

    const { countries } = useCountry({
        queries: {
            getCountriesQuery: GET_ALLOWED_COUNTRIES_QUERY
        }
    });

    const { shippingData } = useShippingInformation({
        onSave: setShippingInformationDone,
        toggleActiveContent: toggleAddressBookContent
    });

    // Check if default shipping address country allowed in current store
    useEffect(() => {
        if (countries && countries.length > 0 && shippingData && shippingData.country && !isPlacingOrder) {
            if (countries.find(country => country.value === shippingData.country.code)) {
                setIsDefaultShippingValid(true);
            } else {
                setIsDefaultShippingValid(false);
            }
        }
    }, [countries, isDefaultShippingValid, isPlacingOrder, shippingData]);

    // If phone number is not valid for existing customers selected shipping address on quote, open edit shipping dialog and show validation error
    useEffect(() => {
        if (isSignedIn && shippingData && shippingData.telephone && shippingData.country.code) {
            const isValid = isValidPhoneNumberForCountry(shippingData.telephone, shippingData.country.code);
            // If message exists, validation failed
            if (isValid && isValid.defaultMessage) {
                setIsShippingPhoneNumberValid(false);
            } else {
                setIsShippingPhoneNumberValid(true);
            }
        }
    }, [shippingData, isSignedIn]);

    return {
        activeContent,
        availablePaymentMethods: checkoutData ? checkoutData.cart && checkoutData.cart.available_payment_methods : null,
        cartItems,
        checkoutStep,
        customer,
        error: checkoutError,
        handlePlaceOrder,
        hasError: !!checkoutError,
        isCartEmpty: !(checkoutData && checkoutData.cart && checkoutData.cart.total_quantity),
        isGuestCheckout: !isSignedIn,
        isLoading,
        isFatoorahRedirect,
        isRedirecting,
        isUpdating,
        isAfterpayOrderPlaced,
        placeOrderData,
        orderDetailsData,
        orderDetailsLoading,
        orderNumber,
        placeOrderLoading,
        setCheckoutStep,
        setIsUpdating,
        setShippingInformationDone,
        setShippingMethodDone,
        setShippingMethodError,
        setPaymentInformationDone,
        scrollShippingInformationIntoView,
        shippingInformationRef,
        shippingMethodRef,
        scrollShippingMethodIntoView,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        reviewOrderButtonClicked,
        toggleAddressBookContent,
        toggleSignInContent,
        showLoader,
        cardInfo: {
            cardType: (paymentInfo && paymentInfo.card_type) || null,
            cardLastFour: (paymentInfo && paymentInfo.last_four) || null
        },
        isDefaultShippingValid,
        isShippingPhoneNumberValid,
        setShowLoader,
        newsletterConsent,
        saveNewsletterConsentMutation,
        cartId,
        shouldRefetchPrices,
        setShouldRefetchPrices
    };
};
