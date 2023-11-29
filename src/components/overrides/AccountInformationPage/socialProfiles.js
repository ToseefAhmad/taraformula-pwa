import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { Facebook, Google } from '@app/components/Icons';
import SocialLink from '@app/components/SocialLogin/SocialButtons/socialLink';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './socialProfiles.module.css';

const SocialProfiles = () => {
    return (
        <Fragment>
            <div className={classes.sectionTitle}>
                <FormattedMessage
                    id={'accountInformationPage.socialSectionTitle'}
                    defaultMessage={'My social profiles'}
                />
            </div>
            <div className={classes.socialProfile}>
                <div className={classes.socialContent}>
                    <Icon classes={{ icon: classes.icon }} src={Facebook} />
                    <div className={classes.socialTitle}>
                        <FormattedMessage id={'global.facebook'} defaultMessage={'Facebook'} />
                    </div>
                </div>
                <SocialLink type="facebook" classes={classes} />
            </div>
            <div className={classes.socialProfile}>
                <div className={classes.socialContent}>
                    <Icon classes={{ icon: classes.icon }} src={Google} />
                    <div className={classes.socialTitle}>
                        <FormattedMessage id={'global.google'} defaultMessage={'Google'} />
                    </div>
                </div>
                <SocialLink type="google" classes={classes} />
            </div>
        </Fragment>
    );
};

export default SocialProfiles;
