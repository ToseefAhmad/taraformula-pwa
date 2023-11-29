import { Form } from 'informed';
import { func, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import DateOfBirth from '@app/components/overrides/CreateAccount/Fields/dateOfBirth';
import Gender from '@app/components/overrides/CreateAccount/Fields/gender';
import AmSocialLogin from '@app/components/SocialLogin';
import { hasLengthAtLeast, isRequired, validatePassword } from '@magento/venia-ui/lib//util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';

import classes from './createAccount.module.css';
import { useCreateAccount } from './useCreateAccount';

const CreateAccount = props => {
    const talonProps = useCreateAccount({
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        onCancel: props.onCancel
    });

    const { handleSubmit, isDisabled, initialValues, handleCancel } = talonProps;
    const { formatMessage } = useIntl();

    const textInputClasses = {
        input: classes.input,
        label: classes.inputLabel,
        input_error: classes.inputError
    };

    const submitButton = (
        <Button disabled={isDisabled} type="submit" priority="primary" fill="solid">
            <FormattedMessage id="createAccount.registerText" defaultMessage="Register" />
        </Button>
    );

    return (
        <Form className={classes.root} initialValues={initialValues} onSubmit={handleSubmit}>
            <h3 className={classes.title}>
                <FormattedMessage id="createAccount.createAccountText" defaultMessage="Create an account" />
            </h3>
            <div className={classes.nameSection}>
                <Field classes={{ root: classes.fieldRoot }}>
                    <TextInput
                        classes={textInputClasses}
                        field="customer.firstname"
                        autoComplete="given-name"
                        validate={isRequired}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        label={formatMessage({
                            id: 'createAccount.firstNameText',
                            defaultMessage: 'First Name'
                        })}
                        optional={false}
                    />
                </Field>
                <Field classes={{ root: classes.fieldRoot }}>
                    <TextInput
                        classes={textInputClasses}
                        field="customer.lastname"
                        autoComplete="family-name"
                        validate={isRequired}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        label={formatMessage({
                            id: 'createAccount.lastNameText',
                            defaultMessage: 'Last Name'
                        })}
                        optional={false}
                    />
                </Field>
            </div>
            <Field>
                <TextInput
                    classes={textInputClasses}
                    field="customer.email"
                    autoComplete="email"
                    validate={isRequired}
                    validateOnBlur
                    mask={value => value && value.trim()}
                    maskOnBlur={true}
                    label={formatMessage({
                        id: 'createAccount.emailText',
                        defaultMessage: 'Email Address'
                    })}
                    optional={false}
                />
            </Field>
            <Field>
                <Gender field="customer.gender" validate={isRequired} />
            </Field>
            <div className={classes.dobSection}>
                <DateOfBirth field="customer.date_of_birth" validate={isRequired} />
            </div>
            <Field>
                <TextInput
                    classes={textInputClasses}
                    autoComplete="new-password"
                    field="password"
                    validate={combine([isRequired, [hasLengthAtLeast, 8], validatePassword])}
                    type="password"
                    label={formatMessage({
                        id: 'createAccount.passwordText',
                        defaultMessage: 'Password'
                    })}
                    optional={false}
                />
            </Field>
            <div className={classes.actions}>
                <div className={classes.description}>
                    <FormattedMessage
                        id="createAccount.instructionsText"
                        defaultMessage="Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our"
                    />{' '}
                    <Link className={classes.descriptionLink} to="privacy-policy">
                        <FormattedMessage id="createAccount.privacyPolicyLinkText" defaultMessage="privacy policy." />
                    </Link>
                </div>
                {submitButton}
                <AmSocialLogin mode={'popup'} page={'createAccount'} />
            </div>
            <Button className={classes.returnButton} type="button" priority="secondary" onClick={handleCancel}>
                <span className={classes.return}>
                    <FormattedMessage id="createAccount.orText" defaultMessage="Or" />{' '}
                    <span>
                        <FormattedMessage id="createAccount.returnText" defaultMessage="return to login" />
                    </span>
                </span>
            </Button>
        </Form>
    );
};

CreateAccount.propTypes = {
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    }),
    onSubmit: func,
    onCancel: func
};

export default CreateAccount;
