import { Form } from 'informed';
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useResetPassword } from '@magento/peregrine/lib/talons/MyAccount/useResetPassword';
import { hasLengthAtLeast, isRequired, validatePassword } from '@magento/venia-ui/lib//util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import resetPasswordOperations from '@magento/venia-ui/lib/components/MyAccount/ResetPassword/resetPassword.gql';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';

import classes from './resetPassword.module.css';

const ResetPassword = () => {
    const { formatMessage } = useIntl();
    const { hasCompleted, loading, token, handleSubmit } = useResetPassword({ ...resetPasswordOperations });
    const PAGE_TITLE = formatMessage({
        id: 'resetPassword.pageTitleText',
        defaultMessage: 'Reset password'
    });

    const textInputClasses = {
        input: classes.input,
        label: classes.inputLabel,
        input_error: classes.inputError
    };

    const tokenMissing = (
        <div className={classes.invalidTokenContainer}>
            <div className={classes.invalidToken}>
                <FormattedMessage
                    id={'resetPassword.invalidTokenMessage'}
                    defaultMessage={'Uh oh, something went wrong. Check the link or try again.'}
                />
            </div>
        </div>
    );

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (hasCompleted) {
            addToast({
                type: ToastType.SUCCESS,
                message: formatMessage({
                    id: 'resetPassword.savedPasswordText',
                    defaultMessage: 'Your new password has been saved.'
                }),
                timeout: 5000
            });
        }
    }, [addToast, formatMessage, hasCompleted]);

    const recoverPassword = hasCompleted ? (
        <div className={classes.successMessage}>
            <FormattedMessage
                id={'resetPassword.successMessage'}
                defaultMessage={'Your new password has been saved. Please use this password to sign into your Account.'}
            />
        </div>
    ) : (
        <Form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.description}>
                <FormattedMessage
                    id={'resetPassword.descriptionText'}
                    defaultMessage={'Please enter your email address and new password.'}
                />
            </div>
            <Field>
                <TextInput
                    classes={textInputClasses}
                    autoComplete="email"
                    field="email"
                    validate={isRequired}
                    label={formatMessage({
                        id: 'resetPassword.emailAddressText',
                        defaultMessage: 'Email Address'
                    })}
                    optional={false}
                />
            </Field>
            <Field>
                <TextInput
                    classes={textInputClasses}
                    autoComplete="new-password"
                    field="newPassword"
                    validate={combine([isRequired, [hasLengthAtLeast, 8], validatePassword])}
                    type="password"
                    label={formatMessage({
                        id: 'resetPassword.newPasswordText',
                        defaultMessage: 'New Password'
                    })}
                    optional={false}
                />
            </Field>
            <Button priority="primary" fill="solid" type="submit" disabled={loading}>
                <FormattedMessage id="resetPassword.savePassword" defaultMessage="Save Password" />
            </Button>
        </Form>
    );

    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <StoreTitle>{PAGE_TITLE}</StoreTitle>
                <h3 className={classes.title}>{PAGE_TITLE}</h3>
                {token ? recoverPassword : tokenMissing}
            </div>
        </div>
    );
};

export default ResetPassword;
