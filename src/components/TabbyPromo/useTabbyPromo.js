import { useMemo } from 'react';

import { useStoreConfigContext } from '@app/context/StoreConfigContext/useStoreConfigContext';

export const useTabbyPromo = () => {
    const { storeConfigData: data } = useStoreConfigContext();

    const publicKey = useMemo(() => {
        return data && data.storeConfig && data.storeConfig.tabby_public_key;
    }, [data]);

    const isEnabled = useMemo(() => {
        return (
            data && data.storeConfig && data.storeConfig.tabby_installments_enabled && data.storeConfig.tabby_public_key
        );
    }, [data]);

    return {
        publicKey,
        isEnabled
    };
};
