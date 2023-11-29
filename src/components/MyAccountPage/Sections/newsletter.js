import { Form } from 'informed';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import sectionClasses from './myAccountSection.module.css';
import defaultClasses from './newsletter.module.css';
import { useNewsletter } from './useNewsletter.js';

const Newsletter = () => {
    const classes = useStyle(sectionClasses, defaultClasses);
    const { formatMessage } = useIntl();
    const { handleSubmit, initialValue, isBusy, isLoading } = useNewsletter();
    const emailLabel = formatMessage({
        id: 'global.email',
        defaultMessage: 'Email'
    });

    const subscribeForm = isLoading ? (
        <div className={classes.shimmerContainer}>
            <Shimmer width={1} height={1} classes={{ root_rectangle: classes.shimmer }} />
            <span className={classes.shimmerLabel}>{emailLabel}</span>
        </div>
    ) : (
        <Form onValueChange={handleSubmit} initialValues={{ isSubscribed: initialValue }}>
            <Checkbox
                classes={{ label: classes.checkboxLabel }}
                label={emailLabel}
                field="isSubscribed"
                disabled={isBusy}
            />
        </Form>
    );

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <h4 className={classes.title}>
                    <FormattedMessage id={'newsletter.sectionTitleText'} defaultMessage={'Contact Preferences'} />
                </h4>
            </div>
            <div className={classes.content}>
                <strong>
                    <FormattedMessage
                        id={'newsletters.contentText'}
                        defaultMessage={
                            'Upcoming releases, exclusive offers, and tips for your hair and skin regimens.'
                        }
                    />
                </strong>
                {subscribeForm}
            </div>
        </div>
    );
};

export default Newsletter;
