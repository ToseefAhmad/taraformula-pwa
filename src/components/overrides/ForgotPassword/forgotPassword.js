import { func, shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useForgotPassword } from '@magento/peregrine/lib/talons/ForgotPassword/useForgotPassword';
import forgotPasswordOperations from '@magento/venia-ui/lib/components/ForgotPassword/forgotPassword.gql';
import ForgotPasswordForm from '@magento/venia-ui/lib/components/ForgotPassword/ForgotPasswordForm';
import FormSubmissionSuccessful from '@magento/venia-ui/lib/components/ForgotPassword/FormSubmissionSuccessful';

import classes from './forgotPassword.module.css';

const ForgotPassword = ({ initialValues, onCancel }) => {
    const { formatMessage } = useIntl();
    const {
        forgotPasswordEmail,
        handleCancel,
        handleFormSubmit,
        hasCompleted,
        isResettingPassword
    } = useForgotPassword({
        onCancel,
        ...forgotPasswordOperations
    });

    const INSTRUCTIONS = formatMessage({
        id: 'forgotPassword.instructions',
        defaultMessage: 'Enter your email to receive instructions on how to reset your password.'
    });
    const children = hasCompleted ? (
        <FormSubmissionSuccessful email={forgotPasswordEmail} />
    ) : (
        <Fragment>
            <h3 className={classes.title}>
                <FormattedMessage id={'forgotPassword.resetPasswordText'} defaultMessage={'Reset password'} />
            </h3>
            <p className={classes.instructions}>{INSTRUCTIONS}</p>
            <ForgotPasswordForm
                initialValues={initialValues}
                isResettingPassword={isResettingPassword}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
            />
        </Fragment>
    );

    return <div className={classes.root}>{children}</div>;
};

export default ForgotPassword;

ForgotPassword.propTypes = {
    initialValues: shape({
        email: string
    }),
    onCancel: func
};

ForgotPassword.defaultProps = {
    onCancel: () => {}
};
