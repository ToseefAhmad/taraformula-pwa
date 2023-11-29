import { useMutation } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';

export const useNewsletterConsent = props => {
    const { cartId, initialValues, setConsentMutation } = props;

    const [smsConsent, setSmsConsent] = useState(initialValues.getNewsletterConsent.sms_consent);
    const [emailConsent, setEmailConsent] = useState(initialValues.getNewsletterConsent.email_consent);

    const [setConsent] = useMutation(setConsentMutation);

    const saveConsent = useCallback(async () => {
        await setConsent({
            variables: {
                sms_consent: smsConsent,
                email_consent: emailConsent,
                cartId
            }
        });
    }, [setConsent, smsConsent, emailConsent, cartId]);

    useEffect(() => {
        saveConsent();
    }, [cartId, smsConsent, emailConsent, saveConsent]);

    return {
        smsConsent,
        setSmsConsent,
        emailConsent,
        setEmailConsent
    };
};
