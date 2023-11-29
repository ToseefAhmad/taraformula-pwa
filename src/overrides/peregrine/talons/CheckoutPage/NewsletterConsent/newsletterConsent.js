import { Form } from 'informed';
import { string, object, any } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { useNewsletterConsent } from '@app/overrides/peregrine/talons/CheckoutPage/NewsletterConsent';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox/checkbox';

const NewsletterConsent = props => {
    const { cartId, initialValues, setConsentMutation } = props;
    const { formatMessage } = useIntl();

    const { smsConsent, setSmsConsent, emailConsent, setEmailConsent } = useNewsletterConsent({
        cartId,
        initialValues,
        setConsentMutation
    });

    return (
        <Form>
            <Checkbox
                field="smsConsent"
                label={formatMessage({
                    id: 'newsletterConsent.sms',
                    defaultMessage: 'I approve to receive promotional SMS messages'
                })}
                initialValue={smsConsent}
                onChange={() => setSmsConsent(!smsConsent)}
            />
            <Checkbox
                field="emailConsent"
                label={formatMessage({
                    id: 'newsletterConsent.email',
                    defaultMessage: 'I approve to receive promotional emails'
                })}
                initialValue={emailConsent}
                onChange={() => setEmailConsent(!emailConsent)}
            />
        </Form>
    );
};

NewsletterConsent.propTypes = {
    cartId: string,
    initialValues: object,
    setConsentMutation: any
};

export default NewsletterConsent;
