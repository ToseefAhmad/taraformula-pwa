import { bool, object, shape, string } from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { useAddressApi } from '@app/components/AddressApi/useAddressApi';
import contactUsClasses from '@app/components/overrides/CheckoutPage/ContactUs/contactUs.module.css';
import CreateAccount from '@app/components/overrides/CheckoutPage/CreateAccount/createAccount';
import ItemsReview from '@app/components/overrides/CheckoutPage/ItemsReview/index';
import defaultClasses from '@app/components/overrides/CheckoutPage/OrderConfirmationPage/orderConfirmationPage.module.css';
import PriceTotals from '@app/components/overrides/CheckoutPage/PriceTotals/priceTotals';
import ShareASale from '@app/components/ShareASale/shareASale';
import useTracking from '@app/hooks/useTracking/useTracking';
import { useOrderConfirmationPage } from '@app/overrides/peregrine/talons/CheckoutPage/OrderConfirmationPage/useOrderConfirmationPage';
import { ReplaceMappingValues } from '@app/util/address/replaceMappingValues';
import { getCartItemSimpleSku } from '@app/util/getCartItemSimpleSku';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import Footer from '@magento/venia-ui/lib/components/Footer';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Header from '@magento/venia-ui/lib/components/Header';

const CMS_BLOCK_ID_CONTACT_US = 'contact-us';
const ORDER_DATA_OPTIONS = { year: 'numeric', month: 'long', day: 'numeric' };

/**
 * Renders order confirmation page component.
 *
 * @param props
 * @returns {JSX.Element}
 */
const OrderConfirmationPage = ({ classes: propClasses, data, orderNumber, cardInfo, failed }) => {
    const history = useHistory();
    const classes = useStyle(defaultClasses, propClasses);
    const [isExecuted, setIsExecuted] = useState(false);
    const { formatMessage } = useIntl();
    const { itemsData, flatData, isSignedIn, orderNumber: orderNr } = useOrderConfirmationPage({ data, orderNumber });
    const {
        city,
        country,
        email,
        firstname,
        lastname,
        postcode,
        region,
        shippingMethod,
        street,
        telephone,
        postal_code,
        selectedPaymentMethod,
        priceTotals
    } = flatData;
    const { trackPurchase, trackUserData, getProductCategories } = useTracking();
    const { countries } = useAddressApi();
    const selectedCountry = countries && countries.filter(apiCountry => apiCountry.key === country)[0];

    let streetRows = street.map((row, index) => {
        return (
            <p key={index} className={classes.orderDetailsItemValue}>
                {row}
            </p>
        );
    });

    if (selectedCountry) {
        const addressLine1 = ReplaceMappingValues(selectedCountry.mapping.address_1, flatData);
        const addressLine2 = ReplaceMappingValues(selectedCountry.mapping.address_2, flatData);

        streetRows = (
            <Fragment>
                <p className={classes.orderDetailsItemValue}>{addressLine1}</p>
                <p className={classes.orderDetailsItemValue}>{addressLine2}</p>
            </Fragment>
        );
    }

    const regionName = region ? `, ${region}` : '';
    let postcodeValue = '';

    if (postcode) {
        postcodeValue = ` ${postcode}`;
    } else if (postal_code) {
        postcodeValue = ` ${postal_code}`;
    }

    const countryName = country;

    const additionalAddressString = `${city}${regionName}${postcodeValue} ${countryName}`;
    const orderDate = new Date().toLocaleDateString('en-GB', ORDER_DATA_OPTIONS);

    const paymentMethod =
        cardInfo && cardInfo.cardType && cardInfo.cardLastFour
            ? `${cardInfo.cardType} *******${cardInfo.cardLastFour}`
            : selectedPaymentMethod.gateway_name
            ? selectedPaymentMethod.gateway_name
            : selectedPaymentMethod.title;

    const gatewayPaymentTranslation = selectedPaymentMethod.gateway_code
        ? formatMessage({
              id: 'paymentMethodCode.myfatoorah_gateway_' + selectedPaymentMethod.gateway_code,
              defaultMessage: paymentMethod
          })
        : null;

    const buttonClasses = {
        root_highPriority: classes.button
    };
    const redirect = () => history.push('/');
    const redirectToAccountPage = () => {
        const path = '/account';
        history.push(path);
    };
    const header = failed ? (
        <FormattedMessage id={'checkout.failed'} defaultMessage={'Payment Failed!'} />
    ) : (
        <FormattedMessage id={'checkout.thankYou'} defaultMessage={'Thank you!'} />
    );

    const orderInfo = failed ? (
        <FormattedMessage
            id={'checkout.paymentFailed'}
            defaultMessage={'The order payment has failed. Please, try to order again!'}
        />
    ) : (
        <FormattedMessage
            id={'checkout.orderInfo'}
            defaultMessage={
                'You have successfully placed the order. You will receive an order' +
                'confirmation e-mail with the details of your order and a link to track its progress'
            }
        />
    );

    if (data && data.cart && data.cart.items && data.cart.items.length > 0 && flatData && !isExecuted) {
        trackUserData(flatData);
        trackPurchase({
            orderId: orderNr,
            revenue: priceTotals.total.value,
            currencyCode: priceTotals.total.currency,
            tax:
                data.cart.prices.applied_taxes &&
                data.cart.prices.applied_taxes.reduce((prev, curr) => prev + curr.amount.value, 0),
            shipping:
                data.cart.shipping_addresses &&
                data.cart.shipping_addresses[0] &&
                data.cart.shipping_addresses[0].selected_shipping_method.amount &&
                data.cart.shipping_addresses[0].selected_shipping_method.amount.value,
            coupon: data.cart.applied_coupons && data.cart.applied_coupons.map(coupon => coupon.code).join(','),
            products: data.cart.items.map(item => ({
                name: item.product.name,
                price:
                    item.product.price_range &&
                    item.product.price_range.maximum_price &&
                    item.product.price_range.maximum_price.final_price &&
                    item.product.price_range.maximum_price.final_price.value,
                quantity: item.quantity,
                sku: getCartItemSimpleSku(item),
                category: item.product.categories ? getProductCategories(item.product.categories) : ''
            }))
        });
        setIsExecuted(true);
    }

    useEffect(() => {
        const { scrollTo } = globalThis;

        if (typeof scrollTo === 'function') {
            scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        }
    }, []);

    return (
        <div>
            <Header />
            <div className={classes.root}>
                <StoreTitle>
                    {formatMessage({
                        id: 'checkoutPage.titleReceipt',
                        defaultMessage: 'Receipt'
                    })}
                </StoreTitle>
                <div className={classes.mainContainer}>
                    <h2 className={`${classes.heading} ${classes.headingOrderConfirm}`}>{header}</h2>
                    <p className={classes.headingOrderConfirmDescription}>{orderInfo}</p>
                    <div className={classes.orderNumber}>
                        <FormattedMessage id={'checkout.orderNumber'} defaultMessage={'The order number is: '} />
                        <span>{orderNr}</span>
                    </div>
                    <div className={classes.returnButton}>
                        <Button classes={buttonClasses} priority="primary" fill="outline" onClick={redirect}>
                            <FormattedMessage
                                id={'checkout.continueShoppingButton'}
                                defaultMessage={'Return to shopping'}
                            />
                        </Button>
                    </div>
                    <h4 className={classes.orderDetails}>
                        <FormattedMessage id={'checkout.orderDetails'} defaultMessage={'Order Details'} />
                    </h4>
                    <div className={classes.orderDetailsBlock}>
                        <div className={classes.orderDetailsColumn}>
                            <div className={classes.orderDetailsItemBlock}>
                                <div className={classes.orderDetailsItem}>
                                    <FormattedMessage id={'global.email'} defaultMessage={'Email'} />
                                </div>
                                <p className={classes.orderDetailsItemValue}>{email}</p>
                            </div>
                            <div className={classes.orderDetailsItemBlock}>
                                <div className={classes.orderDetailsItem}>
                                    <FormattedMessage id={'checkout.paymentMethod'} defaultMessage={'Payment Method'} />
                                </div>
                                <p className={classes.orderDetailsItemValue}>
                                    {gatewayPaymentTranslation || paymentMethod}
                                </p>
                            </div>
                            <div className={classes.orderDetailsItemBlock}>
                                <div className={classes.orderDetailsItem}>
                                    <FormattedMessage id={'checkout.orderDate'} defaultMessage={'Order Date'} />
                                </div>
                                <p className={classes.orderDetailsItemValue}>{orderDate}</p>
                            </div>
                        </div>
                        <div>
                            <div className={classes.orderDetailsItemBlock}>
                                <div className={classes.orderDetailsItem}>
                                    <FormattedMessage
                                        id={'checkout.deliveryOptions'}
                                        defaultMessage={'Delivery Options'}
                                    />
                                </div>
                                <p className={classes.shippingMethod}>{shippingMethod}</p>
                            </div>
                            <div className={classes.orderDetailsItemBlock}>
                                <div className={classes.orderDetailsItem}>
                                    <FormattedMessage
                                        id={'checkout.deliveryAddress'}
                                        defaultMessage={'Delivery Address'}
                                    />
                                </div>
                                <p className={classes.orderDetailsItemValue}>{additionalAddressString}</p>
                                {streetRows}
                            </div>
                            <div className={classes.orderDetailsItemBlock}>
                                <div className={classes.orderDetailsItem}>
                                    <FormattedMessage id={'checkout.phone'} defaultMessage={'Contact Number'} />
                                </div>
                                <p className={classes.orderDetailsItemValue}>{telephone}</p>
                            </div>
                        </div>
                    </div>
                    <div className={classes.itemsReview}>
                        <h4 className={classes.orderSummary}>
                            <FormattedMessage id={'checkout.orderSummary'} defaultMessage={'Order Summary'} />
                        </h4>
                        <ItemsReview data={data || itemsData} />
                        <div className={classes.priceSummary}>
                            <PriceTotals isOrderConfirmationPage={true} isCheckout={true} flatData={priceTotals} />
                        </div>
                    </div>
                </div>
                <div className={classes.sidebarContainer}>
                    {!isSignedIn && (
                        <CreateAccount
                            initialValues={{ firstName: firstname, lastName: lastname, email: email }}
                            isShortForm={true}
                            onSubmit={redirectToAccountPage}
                        />
                    )}
                    <div className={contactUsClasses.container}>
                        <CmsBlock classes={contactUsClasses} identifiers={CMS_BLOCK_ID_CONTACT_US} />
                    </div>
                </div>
            </div>
            <Footer />
            {orderNumber ? <ShareASale orderNumber={orderNumber} subtotal={priceTotals.total.value} /> : null}
        </div>
    );
};

OrderConfirmationPage.propTypes = {
    classes: shape({
        addressStreet: string,
        mainContainer: string,
        heading: string,
        shippingInfoHeading: string,
        shippingInfo: string,
        email: string,
        name: string,
        addressAdditional: string,
        shippingMethodHeading: string,
        shippingMethod: string,
        itemsReview: string,
        additionalText: string,
        sidebarContainer: string,
        orderDetails: string,
        orderNumber: string,
        returnButton: string,
        headingOrderConfirm: string,
        orderDetailsItem: string,
        orderDetailsBlock: string,
        priceSummary: string,
        headingOrderConfirmDescription: string,
        orderDetailsItemBlock: string,
        orderDetailsColumn: string,
        orderSummary: string,
        orderDetailsItemValue: string,
        button: string
    }),
    data: object.isRequired,
    orderNumber: string,
    priceTotals: object,
    cardInfo: object,
    failed: bool
};

OrderConfirmationPage.defaultProps = {
    classes: {},
    data: undefined,
    orderNumber: undefined,
    priceTotals: {},
    cardInfo: {}
};

export default OrderConfirmationPage;
