import { useQuery } from '@apollo/client';

import OPERATIONS from './stripe.gql';

export const useStripeConfig = () => {
    const { data, loading } = useQuery(OPERATIONS.getStripeConfigQuery);

    return {
        stripeConfig: data,
        stripeLoading: loading
    };
};
