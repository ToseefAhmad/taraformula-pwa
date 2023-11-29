import { string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import classes from './formSubmissionSuccessful.module.css';

const FormSubmissionSuccessful = ({ email }) => {
    const { formatMessage } = useIntl();

    const textMessage = formatMessage(
        {
            id: 'formSubmissionSuccessful.textMessage',
            defaultMessage:
                'If there is an account associated with your email address, you will receive an email with a link to change your password.'
        },
        { email }
    );

    return (
        <div className={classes.root}>
            <h3 className={classes.title}>
                <FormattedMessage id="formSubmissionSuccessful.recoverPasswordText" defaultMessage="Recover Password" />
            </h3>
            <p className={classes.text}>{textMessage}</p>
        </div>
    );
};

export default FormSubmissionSuccessful;

FormSubmissionSuccessful.propTypes = {
    email: string
};
