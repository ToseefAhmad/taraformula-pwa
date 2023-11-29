import { string } from 'prop-types';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { useAmBlogProContext } from '@app/components/Blog/context';

import { getAllNetworks } from './networksConfig';
import classes from './socialButtons.module.css';

const SocialButtons = props => {
    const { settings } = useAmBlogProContext() || {};
    const { social_buttons: socialButtons } = settings;
    const { href } = window.location;

    const enabledNetworks = useMemo(() => {
        return (
            socialButtons &&
            getAllNetworks({ ...props, url: href }).filter(({ name }) => socialButtons.indexOf(name) !== -1)
        );
    }, [socialButtons, props, href]);

    if (!enabledNetworks) {
        return null;
    }

    const socButtonList = enabledNetworks.map(({ url, label }, index) => {
        return (
            <a key={index} className={classes.btn} href={url} target="_blank" rel="noreferrer" title={label}>
                <span>{label}</span>
            </a>
        );
    });

    return (
        <div className={classes.root}>
            <span>
                <FormattedMessage id="blog.share" defaultMessage="Share: " />
            </span>
            {socButtonList}
        </div>
    );
};

SocialButtons.propTypes = {
    title: string,
    description: string,
    image: string
};

export default SocialButtons;
