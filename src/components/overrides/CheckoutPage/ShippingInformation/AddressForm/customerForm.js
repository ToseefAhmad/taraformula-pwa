import { Form, Text } from 'informed';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import React, { Fragment, useCallback, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AddressFields from '@app/components/AddressApi/addressFields';
import PhoneNumber from '@app/components/overrides/PhoneNumber/phonenumber';
import { isValidPhoneNumber } from '@app/util/formValidators';
import { useCustomerForm } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/AddressForm/useCustomerForm';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Country from '@magento/venia-ui/lib/components/Country';
import Field, { Message } from '@magento/venia-ui/lib/components/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './customerForm.module.css';

const HEARER_PLUS_SPACE = -120;

const CustomerForm = props => {
    const { afterSubmit, classes: propClasses, onCancel, onSuccess, shippingData, isShippingPhoneNumberValid } = props;
    const formTop = useRef(null);
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const talonProps = useCustomerForm({
        afterSubmit,
        onCancel,
        onSuccess,
        shippingData,
        isShippingPhoneNumberValid,
        formApiRef
    });
    const {
        errors,
        handleCancel,
        handleSubmit,
        hasDefaultShipping,
        initialValues,
        isLoading,
        isSaving,
        isUpdate
    } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'customerForm.loading'} defaultMessage={'Fetching Customer Details...'} />
            </LoadingIndicator>
        );
    }

    const scrollToTop = () => {
        if (formTop.current) {
            formTop.current.scrollIntoView();
            window.scrollBy(0, HEARER_PLUS_SPACE);
        }
    };

    const emailRow = !hasDefaultShipping ? (
        <div className={classes.email}>
            <Field
                id="email"
                label={formatMessage({
                    id: 'global.email',
                    defaultMessage: 'Email'
                })}
                optional={false}
            >
                <TextInput disabled={true} field="email" id="email" validate={isRequired} />
            </Field>
        </div>
    ) : null;

    const formMessageRow = !hasDefaultShipping ? (
        <div className={classes.formMessage}>
            <Message>
                <FormattedMessage
                    id={'customerForm.formMessage'}
                    defaultMessage={
                        'The shipping address you enter will be saved to your address book and set as your default for future purchases.'
                    }
                />
            </Message>
        </div>
    ) : null;

    const cancelButton =
        isUpdate && isShippingPhoneNumberValid ? (
            <Button disabled={isSaving} onClick={handleCancel} priority="low">
                <FormattedMessage id={'global.cancelButton'} defaultMessage={'Cancel'} />
            </Button>
        ) : null;

    const submitButtonText = !hasDefaultShipping
        ? formatMessage({
              id: 'global.saveAndContinueButton',
              defaultMessage: 'Save and Continue'
          })
        : isUpdate
        ? formatMessage({
              id: 'global.updateButton',
              defaultMessage: 'Update'
          })
        : formatMessage({
              id: 'global.addButton',
              defaultMessage: 'Add'
          });
    const submitButtonProps = {
        disabled: isSaving,
        priority: 'high',
        type: 'submit'
    };

    const defaultShippingElement = hasDefaultShipping ? (
        <div className={classes.defaultShipping}>
            <Checkbox
                disabled={!!initialValues.default_shipping}
                id="default_shipping"
                field="default_shipping"
                label={formatMessage({
                    id: 'customerForm.defaultShipping',
                    defaultMessage: 'Make this my default address'
                })}
            />
        </div>
    ) : (
        <Text type="hidden" field="default_shipping" initialValue={true} />
    );

    return (
        <Fragment>
            <FormError errors={Array.from(errors.values())} />
            <div ref={formTop}>
                <Form
                    getApi={setFormApi}
                    className={classes.root}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    onSubmitFailure={scrollToTop}
                >
                    {formMessageRow}
                    {emailRow}
                    <div className={classes.firstname}>
                        <Field
                            id="customer_firstname"
                            label={formatMessage({
                                id: 'global.firstName',
                                defaultMessage: 'First Name'
                            })}
                            optional={false}
                        >
                            <TextInput
                                disabled={!hasDefaultShipping}
                                field="firstname"
                                id="customer_firstname"
                                validate={isRequired}
                            />
                        </Field>
                    </div>
                    <div className={classes.lastname}>
                        <Field
                            id="customer_lastname"
                            label={formatMessage({
                                id: 'global.lastName',
                                defaultMessage: 'Last Name'
                            })}
                            optional={false}
                        >
                            <TextInput
                                disabled={!hasDefaultShipping}
                                field="lastname"
                                id="customer_lastname"
                                validate={isRequired}
                            />
                        </Field>
                    </div>
                    <div className={classes.country}>
                        <Country validate={isRequired} />
                    </div>
                    <AddressFields className={classes.field} countryCodeField={'country'} validate={isRequired} />
                    <div className={classes.telephone}>
                        <PhoneNumber
                            countryCodeField={'country'}
                            field={'telephone'}
                            validate={combine([isRequired, isValidPhoneNumber])}
                        />
                    </div>
                    {defaultShippingElement}
                    <div className={classes.buttons}>
                        {cancelButton}
                        <Button {...submitButtonProps}>{submitButtonText}</Button>
                    </div>
                </Form>
            </div>
        </Fragment>
    );
};

export default CustomerForm;

CustomerForm.defaultProps = {
    shippingData: {
        country: {
            code: ''
        },
        region: {
            id: null
        }
    }
};

CustomerForm.propTypes = {
    afterSubmit: func,
    classes: shape({
        root: string,
        field: string,
        email: string,
        firstname: string,
        lastname: string,
        country: string,
        street0: string,
        street1: string,
        city: string,
        region: string,
        postcode: string,
        telephone: string,
        buttons: string,
        formMessage: string,
        defaultShipping: string
    }),
    onCancel: func,
    onSuccess: func,
    shippingData: shape({
        city: string,
        country: shape({
            code: string.isRequired
        }).isRequired,
        default_shipping: bool,
        email: string,
        firstname: string,
        id: number,
        lastname: string,
        postcode: string,
        region: shape({
            region_id: number,
            region: string
        }),
        street: arrayOf(string),
        telephone: string,
        area: string,
        block: string,
        neighborhood: string,
        zone: string,
        avenue: string,
        house_building: string,
        floor: string,
        building: string,
        flat: string,
        postal_code: string,
        additional_numbers: string,
        id_number: string
    }),
    isShippingPhoneNumberValid: bool
};
