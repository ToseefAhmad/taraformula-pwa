import { object, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useSocialLogin } from '../useSocialLogin';

import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './socialButtons.module.css';

const SocialButton = ({ label, type, icon }) => {
    const { handleLoginClick } = useSocialLogin();
    const iconClasses = { icon: classes.icon };

    return (
        <Button
            priority="primary"
            fill="outline"
            type="button"
            className={classes.socialButton}
            classes={{ content: classes.socialButtonContent }}
            onClick={() => handleLoginClick(type)}
        >
            {icon && <Icon classes={iconClasses} src={icon} />}
            <div className={classes.title}>
                <FormattedMessage id={`global.${type}`} defaultMessage={label} />
            </div>
        </Button>
    );
};

SocialButton.propTypes = {
    label: string,
    type: string,
    icon: object
};

export default SocialButton;
