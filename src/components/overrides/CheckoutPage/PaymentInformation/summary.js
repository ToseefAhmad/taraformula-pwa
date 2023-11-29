import { shape, string, func } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import CodFee from '@app/components/CodFee/codFee';
import { useSummary } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useSummary';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/summary.module.css';
import summaryPayments from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/summaryPaymentCollection';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const Summary = props => {
    const { classes: propClasses, onEdit, resetPayment } = props;
    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = useSummary();

    const { isLoading, selectedPaymentMethod } = talonProps;

    if (isLoading && !selectedPaymentMethod) {
        return (
            <LoadingIndicator classes={{ root: classes.loading }}>
                <FormattedMessage
                    id={'checkoutPage.loadingPaymentInformation'}
                    defaultMessage={'Fetching Payment Information'}
                />
            </LoadingIndicator>
        );
    }
    const hasCustomSummaryComp = selectedPaymentMethod.code in summaryPayments;

    if (hasCustomSummaryComp) {
        const SummaryPaymentMethodComponent = summaryPayments[selectedPaymentMethod.code];
        return <SummaryPaymentMethodComponent onEdit={onEdit} resetPayment={resetPayment} />;
    }

    return (
        <div className={classes.root}>
            <div className={classes.heading_container}>
                <h5 className={classes.heading}>
                    <FormattedMessage id={'checkoutPage.paymentInformation'} defaultMessage={'Payment Information'} />
                </h5>
                <LinkButton className={classes.editButton} onClick={resetPayment} type="button">
                    <span className={classes.editText}>
                        <FormattedMessage id={'global.editButton'} defaultMessage={'Edit'} />
                    </span>
                </LinkButton>
            </div>
            <div className={classes.card_details_container}>
                <div>
                    <span className={classes.payment_details}>{selectedPaymentMethod.title}</span>
                    {selectedPaymentMethod.code === 'cashondelivery' ? <CodFee /> : null}
                </div>
            </div>
        </div>
    );
};

export default Summary;

Summary.propTypes = {
    classes: shape({
        root: string,
        heading_container: string,
        heading: string,
        card_details_container: string,
        payment_details: string,
        editButton: string
    }),
    onEdit: func.isRequired,
    resetPayment: func
};
