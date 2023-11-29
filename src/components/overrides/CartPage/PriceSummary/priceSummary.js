import { node, func, string, bool, oneOfType } from 'prop-types';
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Promo from '@app/components/CartPage/Promo';
import FreeShipping from '@app/components/FreeShipping';
import GetItBy from '@app/components/GetItBy';
import Button from '@app/components/overrides/Button';
import CodSummary from '@app/components/overrides/CartPage/PriceSummary/codSummary';
import TabbyPromo from '@app/components/TabbyPromo';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import DiscountSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/discountSummary';
import GiftCardSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/giftCardSummary';
import ShippingSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/shippingSummary';
import Price from '@magento/venia-ui/lib/components/Price';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './priceSummary.module.css';

/**
 * A child component of the CartPage component.
 * This component fetches and renders cart data, such as subtotal, discounts applied,
 * gift cards applied, tax, shipping, and cart total.
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides.
 * See [priceSummary.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.module.css}
 * for a list of classes you can override.
 *
 * @returns {JSX.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import PriceSummary from "@magento/venia-ui/lib/components/CartPage/PriceSummary";
 */
const PriceSummary = ({
    isDisabled,
    isUpdating,
    setShowComplimentaryGiftModal,
    children,
    shouldRefetchPrices,
    setShouldRefetchPrices
}) => {
    const talonProps = usePriceSummary();

    const {
        handleProceedToCheckout,
        hasError,
        hasItems,
        isCheckout,
        isLoading,
        flatData,
        refetchPriceSummary
    } = talonProps;
    const { subtotal, total, discounts, giftCards, taxes, shipping, appliedCoupons, codFee } = flatData;
    const { formatMessage } = useIntl();
    const hasShippingSummary = shipping && shipping.length && shipping[0].selected_shipping_method;

    useEffect(() => {
        if (shouldRefetchPrices) {
            refetchPriceSummary().then(() => setShouldRefetchPrices(false));
        }
    }, [refetchPriceSummary, shouldRefetchPrices, setShouldRefetchPrices]);

    if (hasError) {
        return (
            <div className={classes.root}>
                <span className={classes.errorText}>
                    <FormattedMessage
                        id={'priceSummary.errorText'}
                        defaultMessage={'Something went wrong. Please refresh and try again.'}
                    />
                </span>
            </div>
        );
    } else if (!hasItems) {
        return null;
    }

    if (isUpdating || shouldRefetchPrices) {
        return (
            <div>
                <Shimmer classes={{ root_rectangle: classes.summaryShimmerTop }} width="100%" />
                {!isCheckout && <Shimmer classes={{ root_rectangle: classes.summaryShimmerBottom }} width="100%" />}
            </div>
        );
    }

    const isPriceUpdating = isUpdating || isLoading;
    const priceClass = isPriceUpdating ? classes.priceUpdating : classes.price;
    const totalPriceClass = isPriceUpdating ? classes.priceUpdating : classes.totalPrice;
    const grandTotalSummaryClass = isCheckout ? classes.grandTotalSummaryCheckout : classes.grandTotalSummary;

    const totalPriceLabel = formatMessage({
        id: 'priceSummary.total',
        defaultMessage: 'Total'
    });

    const proceedToCheckoutButton = !isCheckout ? (
        <div className={classes.checkoutButton_container}>
            <Button disabled={isPriceUpdating || isDisabled} priority={'high'} onClick={handleProceedToCheckout}>
                <FormattedMessage id={'priceSummary.checkoutButton'} defaultMessage={'Proceed to Checkout'} />
            </Button>
        </div>
    ) : null;

    const taxLabel = (
        <span className={classes.doubleLabel}>
            <span className={classes.totalLabel}>
                <FormattedMessage id={'priceSummary.salesTax'} defaultMessage={'Sales Tax'} />
            </span>
            <span className={classes.doubleLabelSecond}>{taxes.length === 0 ? null : taxes[0].label}</span>
        </span>
    );

    return (
        <div className={classes.root}>
            <div className={classes.lineItems}>
                <div className={classes.subTotal}>
                    <span className={classes.subTotalLabel}>
                        <FormattedMessage id={'priceSummary.subtotal'} defaultMessage={'Subtotal'} />
                    </span>
                    <span className={priceClass}>
                        <Price value={subtotal.value} currencyCode={subtotal.currency} />
                    </span>
                </div>
                <DiscountSummary
                    classes={{
                        discountSummary: classes.discountSummary,
                        doubleLabel: classes.doubleLabel,
                        doubleLabelSecond: classes.doubleLabelSecond,
                        discountLabel: classes.discountLabel,
                        price: priceClass
                    }}
                    appliedCoupons={appliedCoupons}
                    data={discounts}
                />
                <GiftCardSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={giftCards}
                />
                <ShippingSummary
                    classes={{
                        shippingSummary: classes.shippingSummary,
                        doubleLabel: classes.doubleLabel,
                        totalLabel: classes.totalLabel,
                        doubleLabelSecond: classes.doubleLabelSecond,
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={shipping}
                    isCheckout={isCheckout}
                />

                {
                    <CodSummary
                        data={codFee}
                        classes={{
                            codSummary: classes.codSummary,
                            codLabel: classes.codLabel,
                            price: priceClass
                        }}
                    />
                }

                {hasShippingSummary && !isCheckout ? (
                    <GetItBy isCart={true} hasShippingSummary={hasShippingSummary} />
                ) : null}

                <div className={classes.taxSummary}>
                    {taxLabel}
                    <span className={priceClass}>
                        <Price value={taxes.length === 0 ? 0 : taxes[0].amount.value} currencyCode={total.currency} />
                    </span>
                </div>

                {!hasShippingSummary && !isCheckout ? (
                    <GetItBy isCart={true} hasShippingSummary={hasShippingSummary} />
                ) : null}

                <div className={classes.couponContainer}>{children}</div>
                <div className={grandTotalSummaryClass}>
                    <span className={classes.grandTotalLabel}>
                        {totalPriceLabel}
                        {!isCheckout && taxes.length === 0 && (
                            <span className={classes.taxesExcluded}>
                                <FormattedMessage
                                    id={'priceSummary.taxesExcluded'}
                                    defaultMessage={'(taxes excluded)'}
                                />
                            </span>
                        )}
                    </span>
                    <span className={totalPriceClass}>
                        <Price currencyCode={total.currency} value={total.value} />
                    </span>
                </div>
            </div>
            {!isCheckout && (
                <div className={classes.freeShipping}>
                    <FreeShipping />
                </div>
            )}
            {!isCheckout && (
                <div className={classes.promotion}>
                    <Promo
                        subtotal={subtotal.value}
                        currency={subtotal.currency}
                        setShowComplimentaryGiftModal={setShowComplimentaryGiftModal}
                    />
                </div>
            )}
            {!isCheckout && (
                <div className={classes.tabby}>
                    <TabbyPromo source="cart" price={total.value} currency={total.currency} />
                </div>
            )}
            {proceedToCheckoutButton}
        </div>
    );
};

PriceSummary.propTypes = {
    children: node,
    classes: string,
    isDisabled: bool,
    isUpdating: oneOfType([func, bool]),
    setShowComplimentaryGiftModal: func,
    shouldRefetchPrices: bool,
    setShouldRefetchPrices: func
};

export default PriceSummary;
