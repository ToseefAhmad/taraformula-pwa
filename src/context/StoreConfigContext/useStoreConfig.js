import { useQuery } from '@apollo/client';
import { useState } from 'react';

import { GET_STORE_CONFIG_DATA } from '@app/context/StoreConfigContext/storeConfig.gql';

export const useStoreConfig = () => {
    const [loading, setLoading] = useState(true);
    const [storeConfigData, setStoreConfigData] = useState(false);

    useQuery(GET_STORE_CONFIG_DATA, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        onCompleted: data => {
            setStoreConfigData(data);
            setLoading(false);
        }
    });

    return {
        loading,
        setLoading,
        storeConfigData,
        setStoreConfigData
    };
};
