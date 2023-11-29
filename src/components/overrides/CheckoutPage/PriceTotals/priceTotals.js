import { bool, shape } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import CodSummary from '@app/components/overrides/CartPage/PriceSummary/codSummary';
import classes from '@app/components/overrides/CheckoutPage/PriceTotals/priceTotals.module.css';
import DiscountSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/discountSummary';
import GiftCardSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/giftCardSummary';
import ShippingSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/shippingSummary';
import Price from '@magento/venia-ui/lib/components/Price';

/**
 * Renders price totals component.
 *
 * @param flatData
 * @param isCheckout
 * @returns {JSX.Element}
 */
const PriceTotals = ({ flatData, isCheckout, isOrderConfirmationPage }) => {
    const { subtotal, total, discounts, giftCards, taxes, shipping, appliedCoupons, codFee } = flatData;
    const { formatMessage } = useIntl();
    const priceClass = classes.price;
    const totalPriceClass = classes.totalPrice;

    const totalPriceLabel = isCheckout
        ? formatMessage({
              id: 'priceSummary.total',
              defaultMessage: 'Total'
          })
        : formatMessage({
              id: 'priceSummary.estimatedTotal',
              defaultMessage: 'Estimated Total'
          });

    return (
        <div>
            <div>
                <div className={classes.subTotal}>
                    <span className={classes.lineItemLabel}>
                        <FormattedMessage id={'priceSummary.lineItemLabel'} defaultMessage={'Subtotal'} />
                    </span>
                    <span className={priceClass}>
                        <Price value={subtotal.value} currencyCode={subtotal.currency} />
                    </span>
                </div>
                <ShippingSummary
                    classes={{
                        totalLabel: classes.lineItemLabel,
                        price: priceClass,
                        shippingSummary: classes.lineItem
                    }}
                    data={shipping}
                    isCheckout={isCheckout}
                    isOrderConfirmationPage={isOrderConfirmationPage}
                />
                {
                    <CodSummary
                        data={codFee}
                        classes={{
                            codSummary: classes.lineItem,
                            codLabel: classes.lineItemLabel,
                            price: priceClass
                        }}
                    />
                }
                <DiscountSummary
                    classes={{
                        discountSummary: classes.lineItem,
                        doubleLabelSecond: classes.discountDoubleLabel,
                        discountLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={discounts}
                    appliedCoupons={appliedCoupons}
                    isCheckout={isCheckout}
                />
                <GiftCardSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={giftCards}
                />
                <div className={classes.lineItem}>
                    <span className={classes.totalLabel}>
                        <FormattedMessage id={'priceSummary.salesTax'} defaultMessage={'Sales Tax'} />
                    </span>
                    <span className={priceClass}>
                        <Price value={taxes.length === 0 ? 0 : taxes[0].amount.value} currencyCode={total.currency} />
                    </span>
                </div>
            </div>
            <p className={classes.totals}>
                <span className={classes.totalLabel}>{totalPriceLabel}</span>
                <span className={totalPriceClass}>
                    <Price value={total.value} currencyCode={total.currency} />
                </span>
            </p>
        </div>
    );
};

PriceTotals.propTypes = {
    flatData: shape({}),
    isCheckout: bool,
    isOrderConfirmationPage: bool
};

PriceTotals.defaultProps = {
    flatData: {},
    isCheckout: true,
    isOrderConfirmationPage: false
};

export default PriceTotals;
