import { shape, string, bool, func } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import CodFee from '@app/components/CodFee/codFee';
import { usePaymentMethods } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods';
import { useStyle } from '@magento/venia-ui/lib/classify';
import payments from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodCollection';
import defaultClasses from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethods.module.css';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import RadioGroup from '@magento/venia-ui/lib/components/RadioGroup';
import Radio from '@magento/venia-ui/lib/components/RadioGroup/radio';

const PaymentMethods = props => {
    const { classes: propClasses, onPaymentError, onPaymentSuccess, resetShouldSubmit, shouldSubmit } = props;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = usePaymentMethods({});

    const { availablePaymentMethods, currentSelectedPaymentMethod, initialSelectedMethod, isLoading } = talonProps;

    if (isLoading) {
        return (
            <>
                <h4 className={classes.editTitle}>
                    <FormattedMessage
                        id={'checkoutPage.paymentInformationStep'}
                        defaultMessage={'3. Payment Information'}
                    />
                </h4>
                <LoadingIndicator classes={{ root: classes.loading }}>
                    <FormattedMessage
                        id={'checkoutPage.loadingPaymentInformation'}
                        defaultMessage={'Fetching Payment Information'}
                    />
                </LoadingIndicator>
            </>
        );
    }

    const radios = availablePaymentMethods
        .map(({ code, title, image }) => {
            // If we don't have an implementation for a method type, ignore it.
            if (!Object.keys(payments).includes(code)) {
                return;
            }

            const id = `paymentMethod--${code}`;
            const isSelected = currentSelectedPaymentMethod === code;
            const PaymentMethodComponent = payments[code];
            const renderedComponent = isSelected ? (
                <div className={classes.paymentContent}>
                    <PaymentMethodComponent
                        onPaymentSuccess={onPaymentSuccess}
                        onPaymentError={onPaymentError}
                        resetShouldSubmit={resetShouldSubmit}
                        shouldSubmit={shouldSubmit}
                    />
                </div>
            ) : null;

            const translatedTitle = formatMessage({
                id: 'paymentMethodCode.' + code,
                defaultMessage: title
            });

            return (
                <div key={code} className={classes.payment_method}>
                    <div className={classes.radioWithMessageContainer}>
                        <Radio
                            id={id}
                            label={translatedTitle}
                            value={code}
                            image={image}
                            classes={{
                                root: classes.radioRoot,
                                label: classes.radio_label
                            }}
                            checked={isSelected}
                        />
                        {code === 'cashondelivery' ? <CodFee /> : null}
                    </div>
                    {renderedComponent}
                </div>
            );
        })
        .filter(paymentMethod => !!paymentMethod);

    const noPaymentMethodMessage = !radios.length && (
        <div className={classes.payment_errors}>
            <span>
                {formatMessage({
                    id: 'checkoutPage.paymentLoadingError',
                    defaultMessage: 'There was an error loading payments.'
                })}
            </span>
            <span>
                {formatMessage({
                    id: 'checkoutPage.refreshOrTryAgainLater',
                    defaultMessage: 'Please refresh or try again later.'
                })}
            </span>
        </div>
    );

    return (
        <div className={classes.root}>
            <RadioGroup
                classes={{ root: classes.radio_group }}
                field="selectedPaymentMethod"
                initialValue={initialSelectedMethod}
            >
                {radios}
            </RadioGroup>
            {noPaymentMethodMessage}
        </div>
    );
};

export default PaymentMethods;

PaymentMethods.propTypes = {
    classes: shape({
        root: string,
        payment_method: string,
        radio_label: string
    }),
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func,
    selectedPaymentMethod: string,
    shouldSubmit: bool
};
