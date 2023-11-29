import { array, string, shape } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';

const MINUS_SYMBOL = '-';

const DEFAULT_AMOUNT = {
    currency: 'USD',
    value: 0
};

/**
 * Reduces discounts array into a single amount.
 *
 * @param {Array} discounts
 */
const getDiscount = (discounts = []) => {
    // Discounts from data can be null
    if (!discounts || !discounts.length) {
        return DEFAULT_AMOUNT;
    } else {
        return {
            currency: discounts[0].amount.currency,
            value: discounts.reduce((acc, discount) => acc + discount.amount.value, 0)
        };
    }
};

/**
 * A component that renders the discount summary line item.
 *
 * @param {Object} classes
 * @param {Object} data fragment response data
 */
const DiscountSummary = ({ appliedCoupons, classes: propClasses, data }) => {
    const classes = useStyle({}, propClasses);
    const discount = getDiscount(data);
    const couponCode = appliedCoupons && appliedCoupons.length > 0 && appliedCoupons[0].code;

    return discount.value ? (
        <div className={classes.discountSummary}>
            <span className={classes.doubleLabel}>
                <span className={classes.discountLabel}>
                    <FormattedMessage id={'discountSummary.discount'} defaultMessage={'Discounts applied'} />
                </span>
                {couponCode && (
                    <span className={classes.doubleLabelSecond}>
                        <FormattedMessage id={'discountSummary.discountCode'} defaultMessage={'Code:'} />
                        &nbsp;
                        {couponCode}
                    </span>
                )}
            </span>
            <span className={classes.price}>
                <span>{MINUS_SYMBOL}</span>
                <Price value={discount.value} currencyCode={discount.currency} />
            </span>
        </div>
    ) : null;
};

DiscountSummary.propTypes = {
    appliedCoupons: array,
    classes: shape({
        lineItemLabel: string,
        price: string,
        coupon: string
    }),
    data: array
};

export default DiscountSummary;
