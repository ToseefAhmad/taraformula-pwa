import { bool, array, string, shape } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';

/**
 * A component that renders the shipping summary line item after address and
 * method are selected
 *
 * @param {Object} props.classes
 * @param {Object} props.data fragment response data
 */
const ShippingSummary = props => {
    const classes = useStyle({}, props.classes);
    const { data, isCheckout, isOrderConfirmationPage } = props;
    const { formatMessage } = useIntl();
    // Don't render estimated shipping until an address has been provided and
    // A method has been selected.
    if (!data.length || !data[0].selected_shipping_method) {
        return null;
    }

    const shipping = data[0].selected_shipping_method.amount;
    const shippingMethod = data[0].selected_shipping_method.method_title;

    const shippingLabel = (
        <span className={classes.doubleLabel}>
            <span className={classes.totalLabel}>
                {isCheckout
                    ? formatMessage({
                          id: 'shippingSummary.shipping',
                          defaultMessage: 'Shipping'
                      })
                    : formatMessage({
                          id: 'shippingSummary.estimatedShipping',
                          defaultMessage: 'Estimated Shipping'
                      })}
            </span>
            {!isOrderConfirmationPage && shippingMethod && (
                <span className={classes.doubleLabelSecond}>{shippingMethod}</span>
            )}
        </span>
    );

    // For a value of "0", display "FREE".
    const price = shipping.value ? (
        <Price value={shipping.value} currencyCode={shipping.currency} />
    ) : (
        <span>
            <FormattedMessage id={'global.free'} defaultMessage={'FREE'} />
        </span>
    );

    return (
        <div className={classes.shippingSummary}>
            {shippingLabel}
            <span className={classes.price}>{price}</span>
        </div>
    );
};

ShippingSummary.propTypes = {
    data: array,
    isCheckout: bool,
    isOrderConfirmationPage: bool,
    classes: shape({
        shippingSummary: string,
        doubleLabel: string,
        totalLabel: string,
        doubleLabelSecond: string,
        lineItemLabel: string,
        price: string
    })
};

export default ShippingSummary;
