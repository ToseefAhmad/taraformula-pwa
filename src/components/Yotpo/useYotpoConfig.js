import { useStoreConfigContext } from '@app/context/StoreConfigContext/useStoreConfigContext';

export const useYotpoConfig = () => {
    const { storeConfigData } = useStoreConfigContext();

    const storeConfig = storeConfigData ? storeConfigData.storeConfig : {};

    return {
        storeConfig
    };
};
