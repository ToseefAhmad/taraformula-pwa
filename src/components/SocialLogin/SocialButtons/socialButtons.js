import { useSocButtons } from '@amasty/social-login/src/talons/useSocButtons';
import { string, array } from 'prop-types';
import React, { Fragment } from 'react';

import { Facebook as FacebookIcon, Google as GoogleIcon } from '@app/components/Icons';

import SocialButton from './socialButton';
import classes from './socialButtons.module.css';

const SocialButtons = ({ buttons, mode }) => {
    const { visibleButtons, errors, errorRef } = useSocButtons({ buttons, mode });
    const icons = {
        facebook: FacebookIcon,
        google: GoogleIcon
    };

    if (!Array.isArray(buttons) || !buttons.length) {
        return null;
    }

    const list = visibleButtons.map((btn, i) => (
        <SocialButton key={i} icon={icons[btn.type]} label={btn.label} type={btn.type} />
    ));

    const errorMessage = errors && errors.message && (
        <span ref={errorRef} className={classes.message}>
            {errors.message}
        </span>
    );

    return (
        <Fragment>
            <div className={classes.list}>{list}</div>
            {errorMessage}
        </Fragment>
    );
};

SocialButtons.propTypes = {
    buttons: array,
    mode: string
};

export default SocialButtons;
