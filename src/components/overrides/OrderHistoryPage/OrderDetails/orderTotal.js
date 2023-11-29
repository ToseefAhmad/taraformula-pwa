import { arrayOf, string, shape, number } from 'prop-types';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import Price from '@magento/venia-ui/lib/components/Price';

import classes from './orderTotal.module.css';

const OrderTotal = ({ data }) => {
    const { discounts, grand_total, subtotal, total_tax, total_shipping } = data;

    const discountRowElement = useMemo(() => {
        if (!discounts || !discounts.length) {
            return null;
        }

        const discountTotal = {
            currency: discounts[0].amount.currency,
            value: discounts.reduce((acc, discount) => acc + discount.amount.value, 0)
        };

        return (
            <tr>
                <td className={classes.label} colSpan="2">
                    <span>
                        <FormattedMessage id="orderDetails.discount" defaultMessage="Discount" />
                    </span>
                </td>
                <td className={classes.cell}>
                    <span>
                        <Price value={discountTotal.value} currencyCode={discountTotal.currency} />
                    </span>
                </td>
            </tr>
        );
    }, [discounts]);

    return (
        <tfoot className={classes.root}>
            <tr>
                <td className={classes.label} colSpan="2">
                    <span>
                        <FormattedMessage id="orderDetails.subtotal" defaultMessage="Subtotal" />
                    </span>
                </td>
                <td className={classes.cell}>
                    <span>
                        <Price value={subtotal.value} currencyCode={subtotal.currency} />
                    </span>
                </td>
            </tr>
            {discountRowElement}
            {total_tax.value !== 0 && (
                <tr>
                    <td className={classes.label} colSpan="2">
                        <span>
                            <FormattedMessage id="orderDetails.tax" defaultMessage="Tax" />
                        </span>
                    </td>
                    <td className={classes.cell}>
                        <span>
                            <Price value={total_tax.value} currencyCode={total_tax.currency} />
                        </span>
                    </td>
                </tr>
            )}
            <tr>
                <td className={classes.label} colSpan="2">
                    <span>
                        <FormattedMessage id="orderDetails.shipping" defaultMessage="Shipping" />
                    </span>
                </td>
                <td className={classes.cell}>
                    <span>
                        <Price value={total_shipping.value} currencyCode={total_shipping.currency} />
                    </span>
                </td>
            </tr>
            <tr>
                <td className={classes.grandTotalLabel} colSpan="2">
                    <span>
                        <FormattedMessage id="orderDetails.total" defaultMessage="Total" />
                    </span>
                </td>
                <td className={classes.grandTotalCell}>
                    <span>
                        <Price value={grand_total.value} currencyCode={grand_total.currency} />
                    </span>
                </td>
            </tr>
        </tfoot>
    );
};

export default OrderTotal;

OrderTotal.propTypes = {
    data: shape({
        discounts: arrayOf(
            shape({
                amount: shape({
                    currency: string,
                    value: number
                })
            })
        ),
        grand_total: shape({
            currency: string,
            value: number
        }),
        subtotal: shape({
            currency: string,
            value: number
        }),
        total_tax: shape({
            currency: string,
            value: number
        }),
        total_shipping: shape({
            currency: string,
            value: number
        })
    })
};
