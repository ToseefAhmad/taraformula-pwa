import { bool, func, object } from 'prop-types';
import React from 'react';
import { AlertCircle } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import AddressFields from '@app/components/AddressApi/addressFields';
import Dialog from '@app/components/AddressBookDialog';
import PhoneNumber from '@app/components/overrides/PhoneNumber/phonenumber';
import { isValidPhoneNumber } from '@app/util/formValidators';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Country from '@magento/venia-ui/lib/components/Country';
import Field from '@magento/venia-ui/lib/components/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Icon from '@magento/venia-ui/lib/components/Icon';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './addEditDialog.module.css';

const AddEditDialog = ({ formErrors, formProps, isBusy, isOpen, onCancel, onConfirm, hasAddresses }) => {
    const { formatMessage } = useIntl();

    const contactInfoTitle = formatMessage({
        id: 'addEditDialog.contactInfoTitle',
        defaultMessage: 'Contact information'
    });
    const addressTitle = formatMessage({
        id: 'addEditDialog.addressTitle',
        defaultMessage: 'Address'
    });
    const firstNameLabel = formatMessage({
        id: 'global.firstName',
        defaultMessage: 'First Name'
    });
    const lastNameLabel = formatMessage({
        id: 'global.lastName',
        defaultMessage: 'Last Name'
    });
    const companyLabel = formatMessage({
        id: 'global.company',
        defaultMessage: 'Company'
    });
    const defaultShippingLabel = formatMessage({
        id: 'addEditDialog.makeDefaultShipping',
        defaultMessage: 'Make this my default shipping address'
    });

    const isDefaultShipping = formProps.initialValues.default_shipping;

    const notifyDefaultShipping = isDefaultShipping && (
        <div className={classes.notification}>
            <Icon src={AlertCircle} size={24} />
            <span className={classes.notificationText}>
                <FormattedMessage
                    id={'addressBookPage.shippingNotification'}
                    defaultMessage={'This is your default shipping address'}
                />
            </span>
        </div>
    );

    return (
        <Dialog
            confirmTranslationId={'addEditAddress.save'}
            confirmText="Save Address"
            formProps={formProps}
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={onConfirm}
            shouldDisableAllButtons={isBusy}
            hasAddresses={hasAddresses}
        >
            <FormError classes={{ root: classes.errorContainer }} errors={Array.from(formErrors.values())} />
            <div className={classes.root}>
                <div className={classes.contactInfoContainer}>
                    <h4 className={classes.title}>{contactInfoTitle}</h4>
                    <Field id="firstname" label={firstNameLabel} optional={false}>
                        <TextInput field="firstname" validate={isRequired} />
                    </Field>
                    <Field id="lastname" label={lastNameLabel} optional={false}>
                        <TextInput field="lastname" validate={isRequired} />
                    </Field>
                    <Field id="company" label={companyLabel} optional={true}>
                        <TextInput field="company" />
                    </Field>
                    <PhoneNumber
                        countryCodeField={'country_code'}
                        field={'telephone'}
                        validate={combine([isRequired, isValidPhoneNumber])}
                    />
                </div>
                <div className={classes.addressContainer}>
                    <h4 className={classes.title}>{addressTitle}</h4>
                    <Country field={'country_code'} validate={isRequired} />
                    <AddressFields countryCodeField={'country_code'} validate={isRequired} />
                    {notifyDefaultShipping}
                    {!isDefaultShipping && (
                        <div className={hasAddresses ? classes.defaultAddressCheck : classes.hidden}>
                            {!isDefaultShipping && (
                                <Checkbox
                                    field="default_shipping"
                                    label={defaultShippingLabel}
                                    initialValue={!hasAddresses && true}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
};

export default AddEditDialog;

AddEditDialog.propTypes = {
    formProps: object,
    formErrors: object,
    isEditMode: bool,
    isOpen: bool,
    isBusy: bool,
    onCancel: func,
    onConfirm: func,
    hasAddresses: bool
};
