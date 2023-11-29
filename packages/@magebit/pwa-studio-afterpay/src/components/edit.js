import { shape, string, bool, func } from 'prop-types';
import React from 'react';

import Afterpay from './afterpay';

/**
 * The edit view for the Afterpay payment method.
 */
const EditAfterpay = ({ onPaymentReady, onPaymentSuccess, onPaymentError, resetShouldSubmit, shouldSubmit }) => {
    return (
        <div className={classes.root}>
            <Afterpay
                onPaymentReady={onPaymentReady}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                resetShouldSubmit={resetShouldSubmit}
                shouldSubmit={shouldSubmit}
            />
        </div>
    );
};

export default EditAfterpay;

EditAfterpay.propTypes = {
    classes: shape({
        root: string
    }),
    onPaymentReady: func.isRequired,
    onPaymentSuccess: func.isRequired,
    onPaymentError: func.isRequired,
    resetShouldSubmit: func.isRequired,
    shouldSubmit: bool
};
