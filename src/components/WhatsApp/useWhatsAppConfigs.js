import { useQuery } from '@apollo/client';

import { GET_WHATS_APP_CONFIGS } from '@app/components/WhatsApp/whatsApp.gql';

export const useWhatsAppConfigs = () => {
    const { data, loading, error } = useQuery(GET_WHATS_APP_CONFIGS, {
        fetchPolicy: 'cache-and-network'
    });

    return {
        data,
        loading,
        error
    };
};
