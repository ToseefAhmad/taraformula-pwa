import { Form } from 'informed';
import { func, shape, string, bool } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './forgotPasswordForm.module.css';

const ForgotPasswordForm = ({ initialValues, isResettingPassword, onSubmit, onCancel }) => {
    const { formatMessage } = useIntl();

    const textInputClasses = {
        input: classes.input,
        label: classes.inputLabel,
        input_error: classes.inputError
    };

    return (
        <Form className={classes.root} initialValues={initialValues} onSubmit={onSubmit}>
            <div className={classes.field}>
                <Field>
                    <TextInput
                        classes={textInputClasses}
                        autoComplete="email"
                        field="email"
                        validate={isRequired}
                        label={formatMessage({
                            id: 'forgotPasswordForm.emailAddressText',
                            defaultMessage: 'Email address'
                        })}
                        optional={false}
                    />
                </Field>
            </div>
            <Button disabled={isResettingPassword} type="submit" priority="primary" fill="solid">
                <FormattedMessage id="forgotPasswordForm.submitButtonText" defaultMessage="Reset password" />
            </Button>
            <Button
                className={classes.returnButton}
                disabled={isResettingPassword}
                type="button"
                priority="secondary"
                onClick={onCancel}
            >
                <span className={classes.return}>
                    <FormattedMessage id="forgotPasswordForm.orText" defaultMessage="Or" />{' '}
                    <span>
                        <FormattedMessage id="forgotPasswordForm.returnText" defaultMessage="return to login" />
                    </span>
                </span>
            </Button>
        </Form>
    );
};

ForgotPasswordForm.propTypes = {
    initialValues: shape({
        email: string
    }),
    onCancel: func.isRequired,
    onSubmit: func.isRequired,
    isResettingPassword: bool
};

ForgotPasswordForm.defaultProps = {
    initialValues: {}
};

export default ForgotPasswordForm;
