import MutationQueueLink from '@adobe/apollo-link-mutation-queue';
import { ApolloLink, createHttpLink } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloClient } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { CachePersistor } from 'apollo-cache-persist';
import getWithPath from 'lodash.get';
import setWithPath from 'lodash.set';
import { useEffect, useMemo, useState, useCallback } from 'react';

import { defaultStoreViewForDomain, getDefaultHostname } from '@app/util/storeViewForDomain';
import attachClient from '@magento/peregrine/lib/Apollo/attachClientToStore';
import { CACHE_PERSIST_PREFIX } from '@magento/peregrine/lib/Apollo/constants';
import MagentoGQLCacheLink from '@magento/peregrine/lib/Apollo/magentoGqlCacheLink';
import typePolicies from '@magento/peregrine/lib/Apollo/policies';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import shrinkQuery from '@magento/peregrine/lib/util/shrinkQuery';

export const useAdapter = props => {
    const { origin, store, styles } = props;
    const storeCode = storage.getItem('store_view_code') || defaultStoreViewForDomain().code;
    const { isDefaultHostname } = useMemo(getDefaultHostname, []);
    const addUrlKey = isDefaultHostname || storeCode !== defaultStoreViewForDomain().code;

    // Do not add store code for default store views.
    const basename = urlHasStoreCode && addUrlKey ? `/${storeCode}` : null;
    const [initialized, setInitialized] = useState(false);

    const apiBase = useMemo(() => new URL('/graphql', origin).toString(), [origin]);

    const authLink = useMemo(
        () =>
            setContext((_, { headers }) => {
                // Get the authentication token from local storage if it exists.
                const token = storage.getItem('signin_token');

                // Return the headers to the context so httpLink can read them
                return {
                    headers: {
                        ...headers,
                        authorization: token ? `Bearer ${token}` : ''
                    }
                };
            }),
        []
    );

    const errorLink = useMemo(
        () =>
            onError(handler => {
                const { graphQLErrors, networkError, response } = handler;

                if (graphQLErrors) {
                    graphQLErrors.forEach(({ message, locations, path }) =>
                        // eslint-disable-next-line no-console
                        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
                    );
                }

                if (networkError) {
                    // eslint-disable-next-line no-console
                    console.log(`[Network error]: ${networkError}`);
                }

                if (response) {
                    const { data, errors } = response;
                    let pathToCartItems;

                    // It's within the GraphQL spec to receive data and errors, where
                    // Errors are merely informational and not intended to block. Almost
                    // All existing components were not built with this in mind, so we
                    // Build special handling of this error message so we can deal with
                    // It at the time we deem appropriate.
                    errors.forEach(({ message, path }, index) => {
                        if (
                            message === 'Some of the products are out of stock.' ||
                            message === 'There are no source items with the in stock status' ||
                            message === 'The requested qty is not available'
                        ) {
                            if (!pathToCartItems) {
                                pathToCartItems = path.slice(0, -1);
                            }

                            // Set the error to null to be cleaned up later
                            response.errors[index] = null;
                        }
                    });

                    // Indicator that we have some cleanup to perform on the response
                    if (pathToCartItems) {
                        const cartItems = getWithPath(data, pathToCartItems);
                        const filteredCartItems = cartItems.filter(cartItem => cartItem !== null);
                        setWithPath(data, pathToCartItems, filteredCartItems);

                        const filteredErrors = response.errors.filter(error => error !== null);
                        // If all errors were stock related and set to null, reset the error response so it doesn't throw
                        response.errors = filteredErrors.length ? filteredErrors : undefined;
                    }
                }
            }),
        []
    );

    // Warning: `useGETForQueries` risks exceeding URL length limits.
    // These limits in practice are typically set at or behind where TLS
    // Terminates. For Magento Cloud & Fastly, 8kb is the maximum by default.
    // https://docs.fastly.com/en/guides/resource-limits#request-and-response-limits
    const httpLink = useMemo(
        () =>
            createHttpLink({
                fetch: customFetchToShrinkQuery,
                useGETForQueries: true,
                uri: apiBase
            }),
        [apiBase]
    );

    const mutationQueueLink = useMemo(() => new MutationQueueLink(), []);

    const retryLink = useMemo(
        () =>
            new RetryLink({
                delay: {
                    initial: 300,
                    max: Infinity,
                    jitter: true
                },
                attempts: {
                    max: 5,
                    retryIf: error => error && !isServer && navigator.onLine
                }
            }),
        []
    );

    const storeLink = useMemo(
        () =>
            setContext((_, { headers }) => {
                const storeCurrency = storage.getItem('store_view_currency') || null;
                const storeCode =
                    storage.getItem('store_view_code') || defaultStoreViewForDomain(location.hostname).code;

                // Return the headers to the context so httpLink can read them
                return {
                    headers: {
                        ...headers,
                        store: storeCode,
                        ...(storeCurrency && {
                            'Content-Currency': storeCurrency
                        })
                    }
                };
            }),
        []
    );

    const magentoGqlCacheLink = useMemo(() => new MagentoGQLCacheLink(), []);

    const apolloLink = useMemo(
        () =>
            ApolloLink.from([
                // Preserve this array order, it's important
                // As the terminating link, `httpLink` must be last
                mutationQueueLink,
                retryLink,
                authLink,
                magentoGqlCacheLink,
                storeLink,
                errorLink,
                httpLink
            ]),
        [authLink, errorLink, httpLink, magentoGqlCacheLink, mutationQueueLink, retryLink, storeLink]
    );

    const apolloClient = useMemo(() => {
        const storeCode = storage.getItem('store_view_code') || 'default';

        const client = new ApolloClient({
            cache: preInstantiatedCache,
            link: apolloLink,
            ssrMode: isServer
        });

        const persistor = isServer
            ? null
            : new CachePersistor({
                  key: `${CACHE_PERSIST_PREFIX}-${storeCode}`,
                  cache: preInstantiatedCache,
                  storage: globalThis.localStorage,
                  debug: process.env.NODE_ENV === 'development'
              });

        client.apiBase = apiBase;
        client.persistor = persistor;

        return client;
    }, [apiBase, apolloLink]);

    const getUserConfirmation = useCallback(async (message, callback) => {
        if (typeof globalThis.handleRouteChangeConfirmation === 'function') {
            return globalThis.handleRouteChangeConfirmation(message, callback);
        }

        return callback(globalThis.confirm(message));
    }, []);

    const apolloProps = { client: apolloClient };
    const reduxProps = { store };
    const routerProps = { basename, getUserConfirmation };
    const styleProps = { initialState: styles };

    // Perform blocking async work here
    useEffect(() => {
        if (initialized) return;

        // Immediately invoke this async function
        (async () => {
            // Restore persisted data to the Apollo cache
            await apolloClient.persistor.restore();

            // Attach the Apollo client to the Redux store
            await attachClient(apolloClient);

            // Mark this routine as complete
            setInitialized(true);
        })();
    }, [apolloClient, initialized]);

    return {
        apolloProps,
        initialized,
        reduxProps,
        routerProps,
        styleProps,
        urlHasStoreCode
    };
};

const isServer = !globalThis.document;
const storage = new BrowserPersistence();
const urlHasStoreCode = process.env.USE_STORE_CODE_IN_URL === 'true';

/**
 * To improve initial load time, create an apollo cache object as soon as
 * this module is executed, since it doesn't depend on any component props.
 * The tradeoff is that we may be creating an instance we don't end up needing.
 */
const preInstantiatedCache = new InMemoryCache({
    // POSSIBLE_TYPES is injected into the bundle by webpack at build time.
    possibleTypes: POSSIBLE_TYPES,
    typePolicies
});

/**
 * Intercept and shrink URLs from GET queries.
 *
 * Using GET makes it possible to use edge caching in Magento Cloud, but risks
 * exceeding URL limits with default usage of Apollo's http link.
 *
 * `shrinkQuery` encodes the URL in a more efficient way.
 *
 * @param {*} uri
 * @param {*} options
 */
const customFetchToShrinkQuery = (uri, options) => {
    // eslint-disable-next-line no-warning-comments
    // TODO: add `ismorphic-fetch` or equivalent to avoid this error
    if (typeof globalThis.fetch !== 'function') {
        console.error('This environment does not define `fetch`.');
        return () => {};
    }

    const resource = options.method === 'GET' ? shrinkQuery(uri) : uri;

    return globalThis.fetch(resource, options);
};
