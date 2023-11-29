import { Form } from 'informed';
import { bool, func, shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import {
    displayStates,
    useShippingMethod
} from '@magento/peregrine/lib/talons/CheckoutPage/ShippingMethod/useShippingMethod';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import CompletedView from '@magento/venia-ui/lib/components/CheckoutPage/ShippingMethod/completedView';
import ShippingRadios from '@magento/venia-ui/lib/components/CheckoutPage/ShippingMethod/shippingRadios';
import UpdateModal from '@magento/venia-ui/lib/components/CheckoutPage/ShippingMethod/updateModal';
import FormError from '@magento/venia-ui/lib/components/FormError';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './shippingMethod.module.css';

const initializingContents = (
    <LoadingIndicator>
        <FormattedMessage id={'shippingMethod.loading'} defaultMessage={'Loading shipping methods...'} />
    </LoadingIndicator>
);

const ShippingMethod = props => {
    const { onSave, onSuccess, onError, pageIsUpdating, setPageIsUpdating } = props;

    const talonProps = useShippingMethod({
        onSave,
        onError,
        onSuccess,
        setPageIsUpdating
    });

    const {
        displayState,
        errors,
        handleCancelUpdate,
        handleSubmit,
        isLoading,
        isUpdateMode,
        selectedShippingMethod,
        shippingMethods,
        showUpdateMode,
        isUpdating
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    let contents;

    if (displayState === displayStates.DONE) {
        const updateFormInitialValues = {
            shipping_method: selectedShippingMethod.serializedValue
        };

        contents = (
            <Fragment>
                <div className={classes.done}>
                    <CompletedView selectedShippingMethod={selectedShippingMethod} showUpdateMode={showUpdateMode} />
                </div>
                <div className={classes.updateModal}>
                    <UpdateModal
                        formErrors={Array.from(errors.values())}
                        formInitialValues={updateFormInitialValues}
                        handleCancel={handleCancelUpdate}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        isOpen={isUpdateMode}
                        pageIsUpdating={pageIsUpdating}
                        shippingMethods={shippingMethods}
                        isUpdating={isUpdating}
                    />
                </div>
            </Fragment>
        );
    } else {
        // We're either initializing or editing.
        let bodyContents = initializingContents;

        if (displayState === displayStates.EDITING) {
            const lowestCostShippingMethodSerializedValue = shippingMethods.length
                ? shippingMethods[0].serializedValue
                : '';
            const lowestCostShippingMethod = {
                shipping_method: lowestCostShippingMethodSerializedValue
            };

            bodyContents = (
                <Form className={classes.form} initialValues={lowestCostShippingMethod} onSubmit={handleSubmit}>
                    <ShippingRadios disabled={pageIsUpdating || isLoading} shippingMethods={shippingMethods} />
                    <div className={classes.formButtons}>
                        <Button priority="primary" type="submit" disabled={pageIsUpdating || isLoading}>
                            <FormattedMessage
                                id={'shippingMethod.continueToNextStep'}
                                defaultMessage={'Continue to Payment Information'}
                            />
                        </Button>
                    </div>
                </Form>
            );
        }

        contents = (
            <div className={classes.root}>
                <h4 className={classes.editingHeading}>
                    <FormattedMessage id={'checkoutPage.shippingMethodStep'} defaultMessage={'2. Shipping Method'} />
                </h4>
                <FormError errors={Array.from(errors.values())} />
                {bodyContents}
            </div>
        );
    }

    return <Fragment>{contents}</Fragment>;
};

ShippingMethod.propTypes = {
    classes: shape({
        done: string,
        editingHeading: string,
        form: string,
        formButtons: string,
        root: string
    }),
    onSave: func.isRequired,
    onSuccess: func.isRequired,
    onError: func.isRequired,
    pageIsUpdating: bool,
    setPageIsUpdating: func.isRequired
};

export default ShippingMethod;
