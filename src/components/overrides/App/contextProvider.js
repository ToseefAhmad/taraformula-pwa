import AmSocialLoginProvider from '@amasty/social-login/src/context';
import React from 'react';

import CaptchaProvider from '@app/components/CaptchaProvider';
import StorageUpdateFromUrl from '@app/components/StorageUpdateFromUrl';
import { AppContextProvider } from '@app/context/App';
import { CmsBlockContextProvider } from '@app/context/CmsBlockContext/useCmsBlockContext';
import { StoreConfigContextProvider } from '@app/context/StoreConfigContext/useStoreConfigContext';
import {
    PeregrineContextProvider as Peregrine,
    ToastContextProvider,
    WindowSizeContextProvider
} from '@magento/peregrine';
import LocaleProvider from '@magento/venia-ui/lib/components/App/localeProvider';

/**
 * List of context providers that are required to run Venia
 *
 * @property {React.Component[]} contextProviders
 */
const contextProviders = [
    StorageUpdateFromUrl,
    LocaleProvider,
    Peregrine,
    StoreConfigContextProvider,
    CmsBlockContextProvider,
    AppContextProvider,
    WindowSizeContextProvider,
    ToastContextProvider,
    CaptchaProvider,
    AmSocialLoginProvider // Added to make Amasty works: packages/@amasty/social-login/targets/extend-intercept.js
];

const ContextProvider = ({ children }) => {
    return contextProviders.reduceRight((memo, ContextProvider) => {
        return <ContextProvider>{memo}</ContextProvider>;
    }, children);
};

export default ContextProvider;
