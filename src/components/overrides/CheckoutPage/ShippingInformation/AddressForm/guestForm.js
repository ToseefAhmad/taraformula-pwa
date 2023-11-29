import { Form } from 'informed';
import { func, shape, string, arrayOf, number } from 'prop-types';
import React, { Fragment, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AddressFields from '@app/components/AddressApi/addressFields';
import StartedGuestCheckout from '@app/components/Klaviyo/startedGuestCheckout';
import PhoneNumber from '@app/components/overrides/PhoneNumber/phonenumber';
import { isEmail } from '@app/util/emailValidator';
import { isValidPhoneNumber } from '@app/util/formValidators';
import { useGuestForm } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/AddressForm/useGuestForm';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Country from '@magento/venia-ui/lib/components/Country';
import Field, { Message } from '@magento/venia-ui/lib/components/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './guestForm.module.css';

const HEARER_PLUS_SPACE = -120;

const GuestForm = props => {
    const { afterSubmit, classes: propClasses, onCancel, onSuccess, shippingData, setIsLoading } = props;
    const formTop = useRef(null);
    const talonProps = useGuestForm({
        afterSubmit,
        onCancel,
        onSuccess,
        shippingData,
        setIsLoading
    });
    const { errors, handleCancel, handleSubmit, initialValues, isSaving, isUpdate } = talonProps;

    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);

    const guestEmailMessage = !isUpdate ? (
        <div className={classes.guestEmailMessage}>
            <Message>
                <FormattedMessage
                    id={'guestForm.emailMessage'}
                    defaultMessage={
                        'Set a password at the end of guest checkout to create an account in one easy step.'
                    }
                />
            </Message>
        </div>
    ) : null;

    const cancelButton = isUpdate ? (
        <Button disabled={isSaving} onClick={handleCancel} priority="low">
            <FormattedMessage id={'global.cancelButton'} defaultMessage={'Cancel'} />
        </Button>
    ) : null;

    const submitButtonText = isUpdate
        ? formatMessage({
              id: 'global.updateButton',
              defaultMessage: 'Update'
          })
        : formatMessage({
              id: 'guestForm.continueToNextStep',
              defaultMessage: 'Continue to Shipping Method'
          });

    const submitButtonProps = {
        disabled: isSaving,
        priority: 'high',
        type: 'submit'
    };

    const scrollToTop = () => {
        if (formTop.current) {
            formTop.current.scrollIntoView();
            window.scrollBy(0, HEARER_PLUS_SPACE);
        }
    };

    return (
        <Fragment>
            <FormError errors={Array.from(errors.values())} />
            <div ref={formTop}>
                <Form
                    className={classes.root}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    onSubmitFailure={scrollToTop}
                >
                    <StartedGuestCheckout />
                    <div className={classes.email}>
                        <Field
                            id="email"
                            label={formatMessage({
                                id: 'global.email',
                                defaultMessage: 'Email Address'
                            })}
                            optional={false}
                        >
                            <TextInput field="email" id="email" validate={combine([isRequired, isEmail])} />
                            {guestEmailMessage}
                        </Field>
                    </div>
                    <div className={classes.firstname}>
                        <Field
                            id="firstname"
                            label={formatMessage({
                                id: 'global.firstName',
                                defaultMessage: 'First Name'
                            })}
                            optional={false}
                        >
                            <TextInput field="firstname" id="firstname" validate={isRequired} />
                        </Field>
                    </div>
                    <div className={classes.lastname}>
                        <Field
                            id="lastname"
                            label={formatMessage({
                                id: 'global.lastName',
                                defaultMessage: 'Last Name'
                            })}
                            optional={false}
                        >
                            <TextInput field="lastname" id="lastname" validate={isRequired} />
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
                    <div className={classes.buttons}>
                        {cancelButton}
                        <Button {...submitButtonProps}>{submitButtonText}</Button>
                    </div>
                </Form>
            </div>
        </Fragment>
    );
};

export default GuestForm;

GuestForm.defaultProps = {
    shippingData: {
        country: {
            code: ''
        },
        region: {
            code: ''
        }
    }
};

GuestForm.propTypes = {
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
        submit: string,
        submit_update: string
    }),
    onCancel: func,
    onSuccess: func.isRequired,
    shippingData: shape({
        city: string,
        country: shape({
            code: string.isRequired
        }).isRequired,
        email: string,
        firstname: string,
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
    setIsLoading: func
};
