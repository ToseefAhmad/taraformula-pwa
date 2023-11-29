import { bool, func, object, shape, string } from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { X as CloseIcon } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import { useAppContext } from '@app/context/App';
import { useEditModal } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/useEditModal';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/CheckoutPage/ShippingInformation/editModal.module.css';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Portal } from '@magento/venia-ui/lib/components/Portal';

import AddressForm from './AddressForm';

const EditModal = props => {
    const { classes: propClasses, shippingData, onSuccess, isShippingPhoneNumberValid } = props;
    const talonProps = useEditModal();
    const { handleClose, isOpen, isLoading, setIsLoading } = talonProps;

    const classes = useStyle(defaultClasses, propClasses);
    const rootClass = isOpen ? classes.root_open : classes.root;
    const [appState, { setCanCloseDrawer }] = useAppContext();

    // If shipping phone number is invalid, disable drawer close
    useEffect(() => {
        if (!isShippingPhoneNumberValid) {
            if (appState.canCloseDrawer !== false) {
                setCanCloseDrawer(false);
            }
        } else {
            if (appState.canCloseDrawer !== true) {
                setCanCloseDrawer(true);
            }
        }
    }, [isShippingPhoneNumberValid, appState, setCanCloseDrawer]);

    // Unmount the form to force a reset back to original values on close
    const bodyElement = isOpen && (
        <AddressForm
            onSuccess={onSuccess}
            afterSubmit={handleClose}
            onCancel={handleClose}
            shippingData={shippingData}
            setIsLoading={setIsLoading}
            isShippingPhoneNumberValid={isShippingPhoneNumberValid}
        />
    );

    const closeButtonIconElement = isShippingPhoneNumberValid ? (
        <button className={classes.closeButton} onClick={handleClose}>
            <Icon src={CloseIcon} />
        </button>
    ) : null;

    const content = isLoading ? (
        <LoadingIndicator classes={{ root: classes.loadingIndicatorRoot }} />
    ) : (
        <Fragment>
            <div className={classes.header}>
                <span className={classes.headerText}>
                    <FormattedMessage
                        id={'checkoutPage.editShippingInfo'}
                        defaultMessage={'Edit Shipping Information'}
                    />
                </span>
                {closeButtonIconElement}
            </div>
            <div className={classes.body}>{bodyElement}</div>
        </Fragment>
    );

    return (
        <Portal>
            <aside className={rootClass}>{content}</aside>
        </Portal>
    );
};

export default EditModal;

EditModal.propTypes = {
    classes: shape({
        root: string,
        root_open: string,
        body: string,
        header: string,
        headerText: string
    }),
    shippingData: object,
    onSuccess: func,
    isShippingPhoneNumberValid: bool
};
