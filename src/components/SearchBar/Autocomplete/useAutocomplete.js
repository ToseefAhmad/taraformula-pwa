import { useLazyQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import { useEffect, useMemo } from 'react';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

export const MessageType = {
    INVALID_CHARACTER_LENGTH: 'INVALID_CHARACTER_LENGTH',
    ERROR: 'ERROR',
    LOADING: 'LOADING',
    PROMPT: 'PROMPT',
    EMPTY_RESULT: 'EMPTY_RESULT',
    RESULT_SUMMARY: 'RESULT_SUMMARY'
};

/**
 * Returns props necessary to render an Autocomplete component.
 *
 * @param {DocumentNode} getAutocompleteResults - graphQl query
 * @param {Boolean} valid - whether to run the query
 */
export const useAutocomplete = ({ queries: { getAutocompleteResults }, valid }) => {
    const [
        ,
        {
            actions: { setOverlayWithoutHeader }
        }
    ] = useAppContext();

    // Prepare to run the queries.
    const [runSearch, productResult] = useLazyQuery(getAutocompleteResults, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    // Get the search term from the field.
    const { value } = useFieldState('search_query');

    // Create a debounced function, so we only search some delay after the last
    // Keypress.
    const debouncedRunQuery = useMemo(
        () =>
            debounce(inputText => {
                runSearch({ variables: { inputText } });
            }, 500),
        [runSearch]
    );

    // Run the query once on mount, and again whenever state changes
    useEffect(() => {
        if (valid) {
            debouncedRunQuery(value);
        }
    }, [debouncedRunQuery, valid, value]);

    const { data, error, loading } = productResult;

    // Handle results.
    const products = data && data.products;
    const filters = data && data.products.aggregations;
    const hasResult = products && products.items;
    const resultCount = products && products.total_count;
    const displayResult = valid && hasResult;
    const invalidCharacterLength = !valid && value;
    const showSuggestions = displayResult && filters && products.items.length > 0;

    let messageType;
    if (invalidCharacterLength) {
        messageType = MessageType.INVALID_CHARACTER_LENGTH;
    } else if (error) {
        messageType = MessageType.ERROR;
    } else if (loading) {
        messageType = MessageType.LOADING;
    } else if (!displayResult) {
        messageType = MessageType.PROMPT;
    } else if (!resultCount) {
        messageType = MessageType.EMPTY_RESULT;
    } else {
        messageType = MessageType.RESULT_SUMMARY;
    }

    // Show overlay if any suggestions
    useEffect(() => {
        setOverlayWithoutHeader(showSuggestions);
    }, [setOverlayWithoutHeader, showSuggestions]);

    return {
        displayResult,
        filters,
        messageType,
        products,
        resultCount,
        value,
        showSuggestions
    };
};
