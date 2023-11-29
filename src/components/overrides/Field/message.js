import { node, number, oneOfType, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './message.module.css';

const Message = props => {
    const { children, classes: propClasses, fieldState } = props;
    const { formatMessage } = useIntl();
    const { error } = fieldState;

    const classes = useStyle(defaultClasses, propClasses);
    const className = error ? classes.root_error : classes.root;
    let translatedErrorMessage;
    const errorValues = [
        {
            id: 'newPassword',
            message: formatMessage({
                id: 'global.password',
                defaultMessage: 'Password'
            })
        }
    ];

    if (error) {
        const errorValue = errorValues.filter(err => err.id === error.value);

        translatedErrorMessage = formatMessage(
            {
                id: error.id,
                defaultMessage: error.defaultMessage
            },
            { value: errorValue.length ? errorValue[0]['message'] : error.value }
        );
    }

    return <p className={className}>{translatedErrorMessage || children}</p>;
};

export default Message;

Message.defaultProps = {
    fieldState: {}
};

Message.propTypes = {
    children: node,
    classes: shape({
        root: string,
        root_error: string
    }),
    fieldState: shape({
        error: shape({
            id: string,
            defaultMessage: string,
            value: oneOfType([number, string])
        })
    })
};
