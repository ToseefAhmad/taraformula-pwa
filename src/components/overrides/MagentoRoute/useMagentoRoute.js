import { useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useRootComponents } from '@magento/peregrine/lib/context/rootComponents';
import { getRootComponent, isRedirect } from '@magento/peregrine/lib/talons/MagentoRoute/helpers';
import { getComponentData } from '@magento/peregrine/lib/util/magentoRouteData';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './magentoRoute.gql';

const getInlinedPageData = () => {
    return globalThis.INLINED_PAGE_TYPE && globalThis.INLINED_PAGE_TYPE.type ? globalThis.INLINED_PAGE_TYPE : null;
};

const resetInlinedPageData = () => {
    globalThis.INLINED_PAGE_TYPE = false;
};

export const useMagentoRoute = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { resolveUrlQuery } = operations;
    const { replace } = useHistory();
    const { pathname, search } = useLocation();
    const [componentMap, setComponentMap] = useRootComponents();

    const [initialized, setInitialized] = useState(false);
    const fetchedPathname = useRef(null);

    const [appState, appApi] = useAppContext();
    const { actions: appActions } = appApi;
    const { nextRootComponent } = appState;
    const { setNextRootComponent, setPageLoading } = appActions;

    const setComponent = useCallback(
        (key, value) => {
            setComponentMap(prevMap => new Map(prevMap).set(key, value));
        },
        [setComponentMap]
    );

    const component = componentMap.get(pathname);

    const [runQuery, queryResult] = useLazyQuery(resolveUrlQuery);
    // Destructure the query result
    const { data, error, loading } = queryResult;
    const { route } = data || {};

    useEffect(() => {
        if (initialized || !getInlinedPageData()) {
            runQuery({
                fetchPolicy: 'cache-and-network',
                nextFetchPolicy: 'cache-first',
                variables: { url: pathname }
            });
            fetchedPathname.current = pathname;
        }
    }, [initialized, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (component) {
            return;
        }

        (async () => {
            const { type, ...routeData } = route || {};
            const { id, identifier, uid } = routeData || {};
            const isEmpty = !id && !identifier && !uid;

            if (!type || isEmpty) {
                return;
            }

            try {
                const rootComponent = await getRootComponent(type);
                setComponent(pathname, {
                    component: rootComponent,
                    ...getComponentData(routeData),
                    type
                });
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }

                setComponent(pathname, error);
            }
        })();
    }, [route]); // eslint-disable-line react-hooks/exhaustive-deps

    const { id, identifier, uid, redirect_code, relative_url, type } = route || {};

    // Evaluate both results and determine the response type
    const empty = !route || !type || (!id && !identifier && !uid);
    const redirect = isRedirect(redirect_code);
    const fetchError = component instanceof Error && component;
    const routeError = fetchError || error;
    const isInitialized = initialized || !getInlinedPageData();

    let showPageLoader = false;
    let routeData;

    const regex = /\/\/+/g;
    if (component && pathname.match(regex)) {
        const cleanUrl = pathname.replace(regex, '/');

        routeData = {
            isRedirect: true,
            relativeUrl: cleanUrl
        };
    } else if (component && !fetchError) {
        // FOUND
        routeData = component;
    } else if (routeError) {
        // ERROR
        routeData = { hasError: true, routeError };
    } else if (redirect) {
        let redirectUrl = relative_url.startsWith('/') ? relative_url : '/' + relative_url;

        // Preserve query params when redirecting
        if (!redirectUrl.includes('?') && search && search.length > 1) {
            redirectUrl += search;
        }

        // REDIRECT
        routeData = {
            isRedirect: true,
            relativeUrl: redirectUrl
        };
    } else if (empty && fetchedPathname.current === pathname && !loading) {
        // NOT FOUND
        routeData = { isNotFound: true };
    } else if (nextRootComponent) {
        // LOADING with full page shimmer
        showPageLoader = true;
        routeData = { isLoading: true, shimmer: nextRootComponent };
    } else {
        // LOADING
        routeData = { isLoading: true, initial: !isInitialized };
    }

    /**
     * This useEffect must be triggered first, because it checks if there is any inline data.
     */
    useEffect(() => {
        (async () => {
            const inlinedData = getInlinedPageData();
            if (inlinedData && (inlinedData.redirect_code && !isRedirect(inlinedData.redirect_code))) {
                try {
                    const componentType = inlinedData.type;
                    const rootComponent = await getRootComponent(componentType);
                    setComponent(pathname, {
                        component: rootComponent,
                        type: componentType,
                        ...getComponentData(inlinedData)
                    });
                } catch (error) {
                    setComponent(pathname, error);
                }
            }
            setInitialized(true);
        })();

        return () => {
            // Unmount
            resetInlinedPageData();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Perform a redirect if necesssary
    useEffect(() => {
        if (routeData && routeData.isRedirect) {
            replace(routeData.relativeUrl);
        }
    }, [queryResult, replace, routeData]);

    useEffect(() => {
        if (component) {
            // Reset loading shimmer whenever component resolves
            setNextRootComponent(null);
        }
    }, [component, pathname, setNextRootComponent]);

    useEffect(() => {
        setPageLoading(showPageLoader);
    }, [showPageLoader, setPageLoading]);

    return routeData;
};
