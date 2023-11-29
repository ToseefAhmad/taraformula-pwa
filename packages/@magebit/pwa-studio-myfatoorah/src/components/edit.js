import { shape, string, bool, func } from 'prop-types';
import React from 'react';

import classes from './edit.module.css';
import EmbedPay from './embedPay';

/**
 * The edit view for the MyFatoorah payment method.
 */
const EditMyFatoorah = ({onPaymentReady, onPaymentSuccess, onPaymentError, resetShouldSubmit, shouldSubmit}) => {
    return (
        <div className={classes.root}>
            <EmbedPay
                onPaymentReady={onPaymentReady}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                resetShouldSubmit={resetShouldSubmit}
                shouldSubmit={shouldSubmit}
            />
        </div>
    );
};

export default EditMyFatoorah;

EditMyFatoorah.propTypes = {
    classes: shape({
        root: string
    }),
    onPaymentReady: func.isRequired,
    onPaymentSuccess: func.isRequired,
    onPaymentError: func.isRequired,
    resetShouldSubmit: func.isRequired,
    shouldSubmit: bool
};
