import { arrayOf, bool, func, number, object, shape, string, array } from 'prop-types';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import ShippingRadios from '@magento/venia-ui/lib/components/CheckoutPage/ShippingMethod/shippingRadios';
import defaultClasses from '@magento/venia-ui/lib/components/CheckoutPage/ShippingMethod/updateModal.module.css';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import FormError from '@magento/venia-ui/lib/components/FormError';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const UpdateModal = props => {
    const {
        classes: propClasses,
        formErrors,
        formInitialValues,
        handleCancel,
        handleSubmit,
        isLoading,
        isOpen,
        pageIsUpdating,
        shippingMethods,
        isUpdating
    } = props;
    const { formatMessage } = useIntl();

    const dialogButtonsDisabled = pageIsUpdating;
    const dialogSubmitButtonDisabled = isLoading;
    const dialogFormProps = {
        initialValues: formInitialValues
    };

    const classes = useStyle(defaultClasses, propClasses);

    return (
        <Dialog
            classes={{
                root: classes.dialogRoot,
                root_open: classes.dialogRootOpen,
                dialog: isUpdating ? classes.dialogHidden : classes.dialog,
                header: isUpdating ? classes.dialogHeaderHidden : classes.dialogHeader,
                headerText: classes.dialogHeaderText,
                buttons: isUpdating ? classes.dialogButtonsHidden : classes.dialogButtons,
                form: classes.dialogForm,
                confirmButton: classes.dialogConfirmButton,
                mask: classes.dialogMask
            }}
            confirmText={'Update'}
            confirmTranslationId={'global.updateButton'}
            formProps={dialogFormProps}
            isOpen={isOpen}
            onCancel={handleCancel}
            onConfirm={handleSubmit}
            shouldDisableAllButtons={dialogButtonsDisabled}
            shouldDisableConfirmButton={dialogSubmitButtonDisabled}
            shouldUnmountOnHide={false}
            title={formatMessage({
                id: 'checkoutPage.editShippingMethod',
                defaultMessage: 'Edit Shipping Method'
            })}
        >
            {isUpdating ? (
                <LoadingIndicator classes={{ root: classes.loadingIndicatorRoot }} />
            ) : (
                <Fragment>
                    <FormError classes={{ root: classes.errorContainer }} errors={formErrors} />
                    <ShippingRadios disabled={dialogButtonsDisabled} shippingMethods={shippingMethods} />
                </Fragment>
            )}
        </Dialog>
    );
};

export default UpdateModal;

UpdateModal.propTypes = {
    formErrors: array,
    classes: shape({
        dialogRoot: string,
        dialogRootOpen: string,
        dialog: string,
        dialogHeader: string,
        dialogHeaderText: string,
        dialogButtons: string,
        dialogForm: string,
        dialogConfirmButton: string,
        errorContainer: string
    }),
    formInitialValues: object,
    handleCancel: func,
    handleSubmit: func,
    isLoading: bool,
    isOpen: bool,
    pageIsUpdating: bool,
    shippingMethods: arrayOf(
        shape({
            amount: shape({
                currency: string,
                value: number
            }),
            available: bool,
            carrier_code: string,
            carrier_title: string,
            method_code: string,
            method_title: string,
            serializedValue: string.isRequired
        })
    ),
    isUpdating: bool
};
