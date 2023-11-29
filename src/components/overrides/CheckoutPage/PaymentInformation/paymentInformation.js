import { Form } from 'informed';
import { shape, func, string, bool, instanceOf } from 'prop-types';
import React, { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';

import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError';
import { usePaymentInformation } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentInformation';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './paymentInformation.module.css';

const PaymentMethods = React.lazy(() => import('./paymentMethods'));
const EditModal = React.lazy(() =>
    import('@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/editModal')
);
const Summary = React.lazy(() => import('@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/summary'));

const PaymentInformation = props => {
    const {
        classes: propClasses,
        onSave,
        resetShouldSubmit,
        setCheckoutStep,
        shouldSubmit,
        checkoutError,
        setShowLoader
    } = props;

    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = usePaymentInformation({
        onSave,
        checkoutError,
        resetShouldSubmit,
        setCheckoutStep,
        shouldSubmit,
        setShowLoader
    });

    const {
        doneEditing,
        handlePaymentError,
        handlePaymentSuccess,
        hideEditModal,
        isLoading,
        isEditModalActive,
        showEditModal,
        handleExpiredPaymentError: resetPayment
    } = talonProps;

    const loadingContent = (
        <div className={classes.loader}>
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
        </div>
    );

    if (isLoading) {
        return loadingContent;
    }

    const paymentInformation = doneEditing ? (
        <div className={classes.summaryBlock}>
            <Summary classes={{ editButton: classes.editButton }} onEdit={showEditModal} resetPayment={resetPayment} />
        </div>
    ) : (
        <div className={classes.editContainer}>
            <h4 className={classes.editTitle}>
                <FormattedMessage
                    id={'checkoutPage.paymentInformationStep'}
                    defaultMessage={'3. Payment Information'}
                />
            </h4>
            <Form>
                <PaymentMethods
                    onPaymentError={handlePaymentError}
                    onPaymentSuccess={handlePaymentSuccess}
                    resetShouldSubmit={resetShouldSubmit}
                    shouldSubmit={shouldSubmit}
                />
            </Form>
        </div>
    );

    const editModal = doneEditing ? (
        <Suspense fallback={null}>
            <EditModal onClose={hideEditModal} isOpen={isEditModalActive} />
        </Suspense>
    ) : null;

    return (
        <div className={classes.root}>
            <div className={classes.payment_info_container}>
                <Suspense fallback={loadingContent}>{paymentInformation}</Suspense>
            </div>
            {editModal}
        </div>
    );
};

export default PaymentInformation;

PaymentInformation.propTypes = {
    classes: shape({
        container: string,
        payment_info_container: string,
        review_order_button: string
    }),
    onSave: func.isRequired,
    checkoutError: instanceOf(CheckoutError),
    resetShouldSubmit: func.isRequired,
    shouldSubmit: bool,
    setCheckoutStep: func,
    setShowLoader: func
};
