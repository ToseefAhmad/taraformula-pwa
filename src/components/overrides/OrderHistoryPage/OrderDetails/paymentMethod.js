import { arrayOf, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import classes from './paymentMethod.module.css';

const PaymentMethod = ({ data: [{ name }] }) => {
    /**
     * There can be multiple payment methods for an order but
     * since Venia does not support multiple payment methods yet
     * we are picking the first method in the array.
     */

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <FormattedMessage id="orderDetails.paymentMethodLabel" defaultMessage="Payment Method" />
            </div>
            <div>{name}</div>
        </div>
    );
};

export default PaymentMethod;

PaymentMethod.propTypes = {
    data: arrayOf(
        shape({
            name: string
        })
    )
};
