import { shape, string } from 'prop-types';
import React from 'react';

import classes from './errorMessage.module.css';

const ErrorMessage = props => {
    const { error } = props;

    if (!error || !error.message) {
        return null;
    }

    return <div className={classes.root}>{error.message}</div>;
};

ErrorMessage.defaultProps = {
    classes: null,
    error: null
};

ErrorMessage.propTypes = {
    classes: shape({
        root: string
    }),
    error: shape({
        message: string
    })
};

export default ErrorMessage;
