import { useQuery } from '@apollo/client';
import OPERATIONS from '@magebit/pwa-studio-stripe/src/talons/stripe.gql';

export const useStripeConfig = () => {
    const { data, loading } = useQuery(OPERATIONS.getStripeConfigQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const showLoadingIndicator = loading && (!data || !!data);

    return {
        stripeConfig: data,
        stripeLoading: loading,
        showLoadingIndicator
    };
};
