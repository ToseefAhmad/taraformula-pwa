import AfterpayRedirect from '@magebit/pwa-studio-afterpay/src/components/Redirect';
import Redirect from '@magebit/pwa-studio-myfatoorah/src/components/Redirect';
import { shape, string } from 'prop-types';
import React, { Fragment, useEffect, useLayoutEffect, useState } from 'react';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import StartedCheckout from '@app/components/Klaviyo/startedCheckout';
import MinimalFooter from '@app/components/MinimalLayout/Footer';
import MinimalHeader from '@app/components/MinimalLayout/Header';
import Button from '@app/components/overrides/Button';
import PriceAdjustments from '@app/components/overrides/CartPage/PriceAdjustments/priceAdjustments';
import classes from '@app/components/overrides/CheckoutPage/checkoutPage.module.css';
import OrderConfirmationPage from '@app/components/overrides/CheckoutPage/OrderConfirmationPage';
import Icon from '@app/components/overrides/Icon';
import { NewsletterConsent } from '@app/overrides/peregrine/talons/CheckoutPage/NewsletterConsent';
import { useCheckoutPage, CHECKOUT_STEP } from '@app/overrides/peregrine/talons/CheckoutPage/useCheckoutPage';
import { useWindowSize, useToasts } from '@magento/peregrine';
import AddressBook from '@magento/venia-ui/lib/components/CheckoutPage/AddressBook';
import GuestSignIn from '@magento/venia-ui/lib/components/CheckoutPage/GuestSignIn';
import OrderSummary from '@magento/venia-ui/lib/components/CheckoutPage/OrderSummary';
import PaymentInformation from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation';
import payments from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodCollection';
import ShippingInformation from '@magento/venia-ui/lib/components/CheckoutPage/ShippingInformation';
import ShippingMethod from '@magento/venia-ui/lib/components/CheckoutPage/ShippingMethod';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import ScrollAnchor from '@magento/venia-ui/lib/components/ScrollAnchor/scrollAnchor';
import StockStatusMessage from '@magento/venia-ui/lib/components/StockStatusMessage';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

/**
 * Renders checkout page component.
 *
 * @returns {JSX.Element|*}
 */
const CheckoutPage = () => {
    const { formatMessage } = useIntl();
    const {
        /**
         * Enum, one of:
         * SHIPPING_ADDRESS, SHIPPING_METHOD, PAYMENT, REVIEW, SUCCESS
         */
        activeContent,
        availablePaymentMethods,
        cartItems,
        checkoutStep,
        customer,
        error,
        handlePlaceOrder,
        hasError,
        isCartEmpty,
        isGuestCheckout,
        isLoading,
        isFatoorahRedirect,
        isRedirecting,
        placeOrderData,
        isUpdating,
        isAfterpayOrderPlaced,
        orderDetailsData,
        orderDetailsLoading,
        orderNumber,
        placeOrderLoading,
        setCheckoutStep,
        setIsUpdating,
        setShippingInformationDone,
        scrollShippingInformationIntoView,
        setShippingMethodDone,
        setShippingMethodError,
        scrollShippingMethodIntoView,
        setPaymentInformationDone,
        shippingInformationRef,
        shippingMethodRef,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        reviewOrderButtonClicked,
        toggleAddressBookContent,
        toggleSignInContent,
        cardInfo,
        showLoader,
        isDefaultShippingValid,
        isShippingPhoneNumberValid,
        setShowLoader,
        cartId,
        newsletterConsent,
        saveNewsletterConsentMutation,
        shouldRefetchPrices,
        setShouldRefetchPrices
    } = useCheckoutPage();

    const [, { addToast }] = useToasts();
    const [isMobile, setIsMobile] = useState(null);

    useEffect(() => {
        if (hasError) {
            const message =
                error && error.message
                    ? error.message
                    : formatMessage({
                          id: 'checkoutPage.errorSubmit',
                          defaultMessage: 'Oops! An error occurred while submitting. Please try again.'
                      });
            addToast({
                type: 'error',
                icon: errorIcon,
                message,
                dismissable: true,
                timeout: 7000
            });

            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
    }, [addToast, error, formatMessage, hasError]);

    useEffect(() => {
        if (customer && customer.default_shipping && !isDefaultShippingValid && checkoutStep === CHECKOUT_STEP.REVIEW) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: formatMessage({
                    id: 'checkoutPage.validationErrorSubmit',
                    defaultMessage: 'Allowed shipping country should be selected'
                }),
                dismissable: true,
                timeout: 7000
            });
        }
    }, [addToast, checkoutStep, customer, formatMessage, isDefaultShippingValid]);

    const { innerWidth } = useWindowSize();
    useLayoutEffect(() => setIsMobile(innerWidth <= 768), [innerWidth]);

    let checkoutContent;

    const heading = isGuestCheckout
        ? formatMessage({
              id: 'checkoutPage.guestCheckout',
              defaultMessage: 'Guest Checkout'
          })
        : formatMessage({
              id: 'checkoutPage.checkout',
              defaultMessage: 'Checkout'
          });

    useEffect(() => {
        if (checkoutStep === CHECKOUT_STEP.REVIEW) {
            setShouldRefetchPrices(true);
        }
    }, [checkoutStep, setShouldRefetchPrices]);

    if (orderNumber && orderDetailsData && !isRedirecting) {
        return <OrderConfirmationPage data={orderDetailsData} orderNumber={orderNumber} cardInfo={cardInfo} />;
    } else if (isFatoorahRedirect) {
        return <Redirect data={orderDetailsData} placeOrderData={placeOrderData} />;
    } else if (isAfterpayOrderPlaced) {
        return <AfterpayRedirect />;
    } else if (isLoading || isRedirecting) {
        return fullPageLoadingIndicator;
    } else if (isCartEmpty) {
        checkoutContent = (
            <div className={classes.empty_cart_container}>
                <div className={classes.heading_container}>
                    <h1 className={classes.heading}>{heading}</h1>
                </div>
                <h3>
                    <FormattedMessage
                        id={'checkoutPage.emptyMessage'}
                        defaultMessage={'There are no items in your cart.'}
                    />
                </h3>
            </div>
        );
    } else {
        const signInContainerElement = isGuestCheckout && (
            <div className={classes.signInContainer}>
                <Button type="button" onClick={toggleSignInContent} priority="primary" fill="solid">
                    <FormattedMessage id={'checkoutPage.signInLabel'} defaultMessage={'Sign in for express checkout'} />
                </Button>
            </div>
        );

        const shippingMethodSection =
            checkoutStep >= CHECKOUT_STEP.SHIPPING_METHOD ? (
                <ShippingMethod
                    pageIsUpdating={isUpdating}
                    onError={setShippingMethodError}
                    onSave={setShippingMethodDone}
                    onSuccess={scrollShippingMethodIntoView}
                    setPageIsUpdating={setIsUpdating}
                />
            ) : (
                <h4 className={classes.shipping_method_heading}>
                    <FormattedMessage id={'checkoutPage.shippingMethodStep'} defaultMessage={'2. Shipping Method'} />
                </h4>
            );

        const formErrors = [];
        const paymentMethods = Object.keys(payments);

        // If we have an implementation, or if this is a "zero" checkout,
        // We can allow checkout to proceed.
        const isPaymentAvailable = !!availablePaymentMethods.find(
            ({ code }) => code === 'free' || paymentMethods.includes(code)
        );

        if (!isPaymentAvailable) {
            formErrors.push(
                new Error(
                    formatMessage({
                        id: 'checkoutPage.noPaymentAvailable',
                        defaultMessage: 'Payment is currently unavailable.'
                    })
                )
            );
        }

        const paymentInformationSection =
            checkoutStep >= CHECKOUT_STEP.PAYMENT ? (
                <PaymentInformation
                    onSave={setPaymentInformationDone}
                    checkoutError={error}
                    resetShouldSubmit={resetReviewOrderButtonClicked}
                    setCheckoutStep={setCheckoutStep}
                    shouldSubmit={reviewOrderButtonClicked}
                    setShowLoader={setShowLoader}
                />
            ) : (
                <h4 className={classes.payment_information_heading}>
                    <FormattedMessage
                        id={'checkoutPage.paymentInformationStep'}
                        defaultMessage={'3. Payment Information'}
                    />
                </h4>
            );

        const priceAdjustmentsSection = checkoutStep === CHECKOUT_STEP.PAYMENT && (
            <div className={classes.price_adjustments_container}>
                <PriceAdjustments
                    classes={{
                        accordionRoot: classes.giftcardAccordionRoot,
                        sectionSubtitle: classes.giftcardSectionSubtitle,
                        sectionTitleWrapper: classes.giftcardSectionTitleWrapper,
                        sectionTitle: classes.giftcardSectionTitle,
                        sectionIcon: classes.giftcardIcon,
                        sectionTitleContainer: classes.giftcardSectionTitleContainer,
                        sectionContentsContainer: classes.giftcardSectionContentsContainer
                    }}
                    setPageIsUpdating={setIsUpdating}
                />
            </div>
        );

        const reviewOrderButton = checkoutStep === CHECKOUT_STEP.PAYMENT && (
            <Button
                onClick={handleReviewOrder}
                priority="high"
                className={classes.review_order_button}
                disabled={reviewOrderButtonClicked || isUpdating || !isPaymentAvailable}
            >
                <FormattedMessage id={'checkoutPage.reviewOrder'} defaultMessage={'Review Order'} />
            </Button>
        );

        const placeOrderButton = checkoutStep === CHECKOUT_STEP.REVIEW && (
            <Button
                onClick={handlePlaceOrder}
                priority="high"
                className={classes.place_order_button}
                disabled={isUpdating || placeOrderLoading || orderDetailsLoading || !isDefaultShippingValid}
            >
                <FormattedMessage id={'checkoutPage.placeOrder'} defaultMessage={'Place Order'} />
            </Button>
        );

        const orderSummary = (
            <div className={classes.summaryContainer}>
                <OrderSummary
                    isUpdating={isUpdating}
                    isCheckout={true}
                    shouldRefetchPrices={shouldRefetchPrices}
                    setShouldRefetchPrices={setShouldRefetchPrices}
                />
            </div>
        );

        let headerText;

        if (isGuestCheckout) {
            headerText = formatMessage({
                id: 'checkoutPage.guestCheckout',
                defaultMessage: 'Guest Checkout'
            });
        } else if (customer.default_shipping) {
            headerText = formatMessage({
                id: 'checkoutPage.reviewAndPlaceOrder',
                defaultMessage: 'Review and Place Order'
            });
        } else {
            headerText = formatMessage(
                { id: 'checkoutPage.greeting', defaultMessage: 'Welcome' },
                { firstname: customer.firstname }
            );
        }

        const checkoutContentClass =
            activeContent === 'checkout' ? classes.checkoutContent : classes.checkoutContent_hidden;

        const stockStatusMessageElement = (
            <Fragment>
                <FormattedMessage
                    id={'checkoutPage.stockStatusMessage'}
                    defaultMessage={
                        'An item in your cart is currently out-of-stock and must be removed in order to Checkout. Please return to your cart to remove the item.'
                    }
                />
                <Link className={classes.cartLink} to={'/cart'}>
                    <FormattedMessage id={'checkoutPage.returnToCart'} defaultMessage={'Return to Cart'} />
                </Link>
            </Fragment>
        );

        checkoutContent = (
            <div className={checkoutContentClass}>
                <StartedCheckout />
                {isMobile ? signInContainerElement : null}
                <div className={classes.heading_container}>
                    <FormError
                        classes={{
                            root: classes.formErrors
                        }}
                        errors={formErrors}
                    />
                    <StockStatusMessage cartItems={cartItems} message={stockStatusMessageElement} />
                    <h1 className={classes.heading}>{headerText}</h1>
                </div>
                <div className={classes.shipping_information_container}>
                    <ScrollAnchor ref={shippingInformationRef}>
                        <ShippingInformation
                            onSave={setShippingInformationDone}
                            onSuccess={scrollShippingInformationIntoView}
                            toggleActiveContent={toggleAddressBookContent}
                        />
                    </ScrollAnchor>
                </div>
                <div className={classes.shipping_method_container}>
                    <ScrollAnchor ref={shippingMethodRef}>{shippingMethodSection}</ScrollAnchor>
                </div>
                <div className={classes.payment_information_container}>{paymentInformationSection}</div>
                {checkoutStep === CHECKOUT_STEP.REVIEW && (
                    <NewsletterConsent
                        cartId={cartId}
                        initialValues={newsletterConsent}
                        setConsentMutation={saveNewsletterConsentMutation}
                    />
                )}
                {priceAdjustmentsSection}
                {reviewOrderButton}
                <div className={classes.orderSummaryAside}>
                    {!isMobile ? signInContainerElement : null}
                    {orderSummary}
                </div>

                {placeOrderButton}
            </div>
        );
    }

    const addressBookElement = !isGuestCheckout && (
        <AddressBook
            activeContent={activeContent}
            toggleActiveContent={toggleAddressBookContent}
            onSuccess={scrollShippingInformationIntoView}
            isShippingPhoneNumberValid={isShippingPhoneNumberValid}
        />
    );

    const signInElement = isGuestCheckout && (
        <GuestSignIn isActive={activeContent === 'signIn'} toggleActiveContent={toggleSignInContent} />
    );

    const loader = showLoader && fullPageLoadingIndicator;

    return (
        <div>
            <MinimalHeader />
            <div className={classes.root}>
                <StoreTitle>
                    {formatMessage({
                        id: 'checkoutPage.titleCheckout',
                        defaultMessage: 'Checkout'
                    })}
                </StoreTitle>
                {checkoutContent}
                {addressBookElement}
                {signInElement}
            </div>
            <MinimalFooter />
            {loader}
        </div>
    );
};

CheckoutPage.propTypes = {
    classes: shape({
        root: string,
        checkoutContent: string,
        checkoutContent_hidden: string,
        heading_container: string,
        heading: string,
        cartLink: string,
        stepper_heading: string,
        shipping_method_heading: string,
        payment_information_heading: string,
        signInContainer: string,
        signInLabel: string,
        signInButton: string,
        empty_cart_container: string,
        shipping_information_container: string,
        shipping_method_container: string,
        payment_information_container: string,
        price_adjustments_container: string,
        items_review_container: string,
        summaryContainer: string,
        formErrors: string,
        review_order_button: string,
        place_order_button: string
    })
};

CheckoutPage.defaultProps = {
    classes: {}
};

export default CheckoutPage;
