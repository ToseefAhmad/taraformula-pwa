import { Form } from 'informed';
import { func, object, bool, array } from 'prop-types';
import React, { Fragment, useRef, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import DateOfBirth from '@app/components/overrides/CreateAccount/Fields/dateOfBirth';
import Gender from '@app/components/overrides/CreateAccount/Fields/gender';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import FormError from '@magento/venia-ui/lib/components/FormError';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import {
    isRequired,
    hasLengthAtLeast,
    validatePassword,
    isNotEqualToField,
    isEqualToField
} from '@magento/venia-ui/lib/util/formValidators';

import classes from './editForm.module.css';

const EditForm = ({
    handleEmailChange,
    handleChangePassword,
    handleCancelChangePassword,
    handleSubmit,
    handleCancel,
    shouldShowNewPassword,
    shouldRequestPassword,
    initialValues,
    formErrors,
    isDisabled
}) => {
    const { formatMessage } = useIntl();

    const checkboxClasses = {
        input: classes.checkboxInput,
        label: classes.checkboxLabel,
        checkbox_inactive: classes.checkboxInactive,
        checkbox_active: classes.checkboxActive
    };

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const handleDiscard = () => {
        formApiRef.current.reset();
        handleCancel();
    };

    const passwordField = isForEmail => {
        const message = isForEmail
            ? formatMessage({ id: 'editForm.passwordText', defaultMessage: 'Enter your password' })
            : formatMessage({ id: 'editForm.currentPasswordText', defaultMessage: 'Enter your current password' });

        return (
            <div className={isForEmail ? classes.currentPasswordEmail : classes.currentPassword}>
                <TextInput
                    field="password"
                    type="password"
                    label={message}
                    validate={isRequired}
                    autoComplete={'new-password'}
                    optional={false}
                />
            </div>
        );
    };

    const maybeNewPasswordFieldCheckbox = (
        <div className={classes.checkboxField}>
            <Checkbox
                classes={checkboxClasses}
                label={formatMessage({
                    id: 'editForm.changePasswordCheckbox',
                    defaultMessage: 'Change my password'
                })}
                field="shouldShowPasswordField"
                fieldValue={shouldShowNewPassword}
                onClick={shouldShowNewPassword ? handleCancelChangePassword : handleChangePassword}
            />
        </div>
    );

    const maybeNewPasswordField = shouldShowNewPassword ? (
        <div className={classes.passwordRoot}>
            {passwordField(false)}
            <div className={classes.newPassword}>
                <TextInput
                    field="newPassword"
                    type="password"
                    label={formatMessage({
                        id: 'editForm.newPasswordText',
                        defaultMessage: 'Enter your new password'
                    })}
                    validate={combine([
                        isRequired,
                        [hasLengthAtLeast, 8],
                        validatePassword,
                        [isNotEqualToField, 'password']
                    ])}
                    optional={false}
                />
            </div>
            <div className={classes.repeatPassword}>
                <TextInput
                    field="newPasswordRepeat"
                    type="password"
                    label={formatMessage({
                        id: 'editForm.newPasswordRepeatText',
                        defaultMessage: 'Reenter your password'
                    })}
                    validate={combine([
                        isRequired,
                        [hasLengthAtLeast, 8],
                        validatePassword,
                        [isEqualToField, 'newPassword']
                    ])}
                    optional={false}
                />
            </div>
        </div>
    ) : null;

    const formProps = { initialValues };

    return (
        <Fragment>
            <FormError classes={{ root: classes.errorContainer }} errors={formErrors} />
            <Form className={classes.form} {...formProps} getApi={setFormApi} onSubmit={handleSubmit}>
                <div className={classes.root}>
                    <div className={classes.firstname}>
                        <TextInput
                            field="firstname"
                            validate={isRequired}
                            optional={false}
                            label={formatMessage({
                                id: 'global.firstName',
                                defaultMessage: 'First Name'
                            })}
                        />
                    </div>
                    <div className={classes.lastname}>
                        <TextInput
                            field="lastname"
                            validate={isRequired}
                            optional={false}
                            label={formatMessage({
                                id: 'global.lastName',
                                defaultMessage: 'Last Name'
                            })}
                        />
                    </div>
                    <div className={classes.email}>
                        <TextInput
                            label={formatMessage({
                                id: 'global.email',
                                defaultMessage: 'Email'
                            })}
                            field="email"
                            validate={isRequired}
                            onChange={handleEmailChange}
                            optional={false}
                        />
                    </div>
                    <div className={classes.gender}>
                        <Gender field="gender" validate={isRequired} />
                    </div>
                    <div className={classes.dobSection}>
                        <DateOfBirth
                            field="date_of_birth"
                            validate={isRequired}
                            initialValue={initialValues.date_of_birth}
                        />
                    </div>
                    {shouldRequestPassword && !shouldShowNewPassword ? passwordField(true) : null}
                    {maybeNewPasswordFieldCheckbox}
                    {maybeNewPasswordField}
                    <div className={classes.buttonsContainer}>
                        <div className={classes.saveButtonContainer}>
                            <Button
                                className={classes.saveButton}
                                type="submit"
                                priority="primary"
                                fill="solid"
                                disabled={isDisabled}
                            >
                                <FormattedMessage id={'global.saveButton'} defaultMessage={'Save Details'} />
                            </Button>
                        </div>
                        <div className={classes.discardButtonContainer}>
                            <Button
                                className={classes.discardButton}
                                onClick={handleDiscard}
                                priority="secondary"
                                fill="outline"
                                disabled={isDisabled}
                            >
                                <FormattedMessage id={'global.discardButton'} defaultMessage={'Discard Changes'} />
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
        </Fragment>
    );
};

export default EditForm;

EditForm.propTypes = {
    handleChangePassword: func,
    handleCancelChangePassword: func,
    handleEmailChange: func,
    handleSubmit: func,
    handleCancel: func,
    shouldShowNewPassword: bool,
    shouldRequestPassword: bool,
    initialValues: object,
    formErrors: array,
    isDisabled: bool
};
