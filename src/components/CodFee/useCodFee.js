import { useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './codFee.gql';

export const useCodFee = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { getCashondeliveryConfigData } = operations;

    const { data: codData, loading: codDataLoading, error: codDataError } = useQuery(getCashondeliveryConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    return {
        codData,
        codDataLoading,
        codDataError
    };
};
