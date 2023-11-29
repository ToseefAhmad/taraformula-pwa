import { shape, string, bool, func } from 'prop-types';
import React from 'react';

import classes from './edit.module.css';
import Stripe from './stripe';

/**
 * The edit view for the Stripe payment method.
 */
const EditStripe = ({onPaymentReady, onPaymentSuccess, onPaymentError, resetShouldSubmit, shouldSubmit}) => {
    return (
        <div className={classes.root}>
            <Stripe
                onPaymentReady={onPaymentReady}
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                resetShouldSubmit={resetShouldSubmit}
                shouldSubmit={shouldSubmit}
            />
        </div>
    );
};

export default EditStripe;

EditStripe.propTypes = {
    classes: shape({
        root: string
    }),
    onPaymentReady: func.isRequired,
    onPaymentSuccess: func.isRequired,
    onPaymentError: func.isRequired,
    resetShouldSubmit: func.isRequired,
    shouldSubmit: bool
};
