import { Form } from 'informed';
import { shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { NewsletterArrow as NewsletterArrowIcon } from '@app/components/Icons';
import { useNewsletter } from '@magento/peregrine/lib/talons/Newsletter/useNewsletter';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './newsletter.module.css';

const Newsletter = props => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useNewsletter();
    const { handleSubmit, isBusy, setFormApi } = talonProps;

    const maybeLoadingIndicator = isBusy ? (
        <div className={classes.loadingContainer}>
            <LoadingIndicator classes={{ message: classes.message }}>
                <FormattedMessage id={'newsletter.loadingText'} defaultMessage={'Subscribing'} />
            </LoadingIndicator>
        </div>
    ) : null;

    return (
        <div className={classes.root}>
            {maybeLoadingIndicator}
            <h5 className={classes.title}>
                <FormattedMessage id={'newsletter.titleText'} defaultMessage={'Subscribe to our newsletter'} />
            </h5>

            <p className={classes.newsletter_text}>
                <FormattedMessage
                    id={'newsletter.infoText'}
                    defaultMessage={
                        'Be the first to know about new product launches, promo codes, early access and more.'
                    }
                />
            </p>
            <Form getApi={setFormApi} className={classes.form} onSubmit={handleSubmit}>
                <Field
                    id="email"
                    label={formatMessage({
                        id: 'newsletter.enterYourEmail',
                        defaultMessage: 'enter your email'
                    })}
                >
                    <TextInput
                        classes={{
                            input: classes.newsletterInput,
                            input_error: classes.newsletterInput_error,
                            label: classes.newsletterInputLabel
                        }}
                        autoComplete="email"
                        field="email"
                        id="email"
                        validate={isRequired}
                    />
                </Field>
                <LinkButton className={classes.subscribeLink} type="submit" disabled={isBusy}>
                    <Icon src={NewsletterArrowIcon} />
                </LinkButton>
                <LinkButton className={classes.subscribeLinkDesktop} type="submit" disabled={isBusy}>
                    <FormattedMessage id={'newsletter.submitText'} defaultMessage={'Submit'} />
                </LinkButton>
            </Form>
        </div>
    );
};

Newsletter.propTypes = {
    classes: shape({
        modal_active: string,
        root: string,
        title: string,
        newsletter_text: string,
        form: string
    })
};

export default Newsletter;
