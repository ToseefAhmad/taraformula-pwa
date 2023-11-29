import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const RECAPTCHA_HEADER_KEY = 'X-ReCaptcha';

export const useCaptcha = () => {
    const { executeRecaptcha } = useGoogleReCaptcha();
    const [token, setToken] = useState('');

    const executeCaptchaValidation = async action => {
        if (!executeRecaptcha) {
            return;
        }

        try {
            const result = await executeRecaptcha(action);
            setToken(result);
        } catch (error) {
            setToken('');
        }
    };

    const captchaHeaders = {
        [RECAPTCHA_HEADER_KEY]: token
    };

    return {
        captchaHeaders,
        executeCaptchaValidation
    };
};
