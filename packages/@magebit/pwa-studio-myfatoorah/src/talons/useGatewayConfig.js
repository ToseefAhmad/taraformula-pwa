import { useQuery } from '@apollo/client';

import OPERATIONS from './myFatoorah.gql';

export const useGatewayConfig = () => {
    const { data, loading } = useQuery(OPERATIONS.getGatewayConfigQuery);

    return {
        gatewayConfig: data,
        gatewayConfigLoading: loading
    };
};
