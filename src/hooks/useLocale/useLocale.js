import { useMemo } from 'react';

import { useStoreConfigContext } from '@app/context/StoreConfigContext/useStoreConfigContext';

export const useLocale = () => {
    const { storeConfigData: storeConfigLocale } = useStoreConfigContext();

    const currentStoreLocale = useMemo(() => {
        if (storeConfigLocale) {
            return storeConfigLocale.storeConfig.locale;
        }
    }, [storeConfigLocale]);

    return {
        currentStoreLocale
    };
};
