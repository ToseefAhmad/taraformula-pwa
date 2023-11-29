import { useStoreConfigContext } from '@app/context/StoreConfigContext/useStoreConfigContext';

export const useCaptchaProvider = () => {
    const { loading, storeConfigData: data } = useStoreConfigContext();

    const captchaData = !loading && data;
    const captchaKey = captchaData && captchaData.storeConfig.captcha_key;
    const captchaLanguage = captchaData && captchaData.storeConfig.captcha_language;

    return {
        loading,
        captchaKey,
        captchaLanguage
    };
};
