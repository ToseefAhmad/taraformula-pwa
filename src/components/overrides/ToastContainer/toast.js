import classnames from 'classnames';
import { bool, node, string, func, number, oneOfType, object } from 'prop-types';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import classes from './toast.module.css';

const Toast = ({ dismissable, icon, message, onDismiss, handleDismiss, type, timeout, link }) => {
    const iconElement = useMemo(() => {
        if (icon) {
            return icon;
        }
    }, [icon]);

    const controls =
        onDismiss || dismissable ? (
            <button className={classes.dismissButton} onClick={handleDismiss}>
                <FormattedMessage id="toast.close" defaultMessage="Close" />
            </button>
        ) : null;

    const messageLink = link && link.text && link.url && (
        <Link className={classes.messageLink} to={link.url}>
            <FormattedMessage id={`toast.${link.text}`} defaultMessage={link.text} />
        </Link>
    );

    return (
        <div className={classnames(classes.root, classes[`${type}Toast`])}>
            <div className={classes.container}>
                <div className={classes.messageContainer}>
                    {iconElement}
                    <div className={classes.messageContainerText}>
                        <div className={classes.message}>{message}</div>
                        {messageLink}
                    </div>
                </div>
                <div className={classes.controls}>{controls}</div>
            </div>
            {timeout && <div className={classes.progress} style={{ animationDuration: `${timeout}ms` }} />}
        </div>
    );
};

Toast.propTypes = {
    dismissable: bool,
    icon: node,
    message: string,
    onDismiss: func,
    handleDismiss: func,
    type: string,
    timeout: oneOfType([bool, number]),
    link: object
};

Toast.defaultProps = {
    dismissable: true
};

export default Toast;
