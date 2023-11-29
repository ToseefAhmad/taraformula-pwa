import { useCallback, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useRedirectContext } from '@app/context/RedirectContext/useRedirectContext';
import { defaultStoreViewForDomain, storeViewsForDomain, getDefaultHostname } from '@app/util/storeViewForDomain';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

/**
 * This component checks for use of a store code in the url that is not the
 * current base. If found, it updates the local storage values for code/currency
 * and reloads the page so that they are used in the graphQL headers.
 */
const StoreCodeRoute = () => {
    const history = useHistory();
    const { setIsRedirectCompleted } = useRedirectContext();
    const storeCodes = [];
    const storeCurrencies = useMemo(() => ({}), []);
    const storeSecureBaseMediaUrl = useMemo(() => ({}), []);

    // Get available store views for current domain
    const availableStoreViews = storeViewsForDomain();

    availableStoreViews.forEach(store => {
        storeCodes.push(store.code);
        storeCurrencies[store.code] = store.default_display_currency_code;
        storeSecureBaseMediaUrl[store.code] = store.secure_base_media_url;
    });

    const setStorageStoreCode = useCallback(
        storeCode => {
            storage.setItem('store_view_code', storeCode);
            storage.setItem('store_view_currency', storeCurrencies[storeCode]);
            storage.setItem('store_view_secure_base_media_url', storeSecureBaseMediaUrl[storeCode]);
        },
        [storeCurrencies, storeSecureBaseMediaUrl]
    );

    const { defaultHostname, isDefaultHostname } = useMemo(getDefaultHostname, []);

    // Sort by length (longest first) to avoid false hits ie "en" matching just
    // The "/en" in "/en-us/home.html" when "en-us" is also in storeCodes.
    storeCodes.sort((a, b) => b.length - a.length);

    // Find the store code in the url. This will always be the first path.
    // I.e. `https://example.com/fr/foo/baz.html` => `fr`.
    const regex = new RegExp(`^/(${storeCodes.join('|')})`, 'g');
    const { location } = globalThis;
    const { pathname } = location;
    let { search } = location;
    const match = location && pathname.match(regex);
    const storeCodeInUrl = match && match[0].replace(/\//g, '');

    // Process redirects via ?lang= parameter
    const searchParams = new URLSearchParams(search);
    const isGeoRedirected = searchParams.get('geo-redirect') === 'true';
    searchParams.delete('geo-redirect');
    search = searchParams.toString();

    // Determine what the current store code is used.
    const currentStoreCode = storage.getItem('store_view_code') || defaultStoreViewForDomain().code;
    const defaultStore = defaultStoreViewForDomain();

    useEffect(() => {
        // If store code is in the url - update storage if necessary
        if (storeCodeInUrl) {
            // Check if store code in storage and url is the same
            if (currentStoreCode !== storeCodeInUrl) {
                setStorageStoreCode(storeCodeInUrl);
                history.go(0);
                return;
            } else if (!isDefaultHostname && storeCodeInUrl === defaultStore.code) {
                setStorageStoreCode(storeCodeInUrl);
                history.replace({ pathname: pathname.replace(storeCodeInUrl, ''), search }, null);
                history.go(0);
                return;
            }
        } else {
            // If store code is not in the url - we need to open default store view for current domain
            // Add store key if it is default domain
            if (isDefaultHostname) {
                history.replace({ pathname, search }, null);
                history.go(0);
                return;
            }

            // If we have been redirected via ?lang= parameter without a store code, then use the default store
            if (currentStoreCode !== defaultStore.code) {
                setStorageStoreCode(isGeoRedirected ? defaultStore.code : currentStoreCode);

                // Reload current location after changing store info
                if (isGeoRedirected) {
                    location.search = search;
                    location.reload();
                    return;
                }

                history.replace({ pathname, search }, null);
                history.go(0);
                return;
            }
        }

        // If we have been redirected via ?lang= parameter, remove the geo-redirect parameter
        if (isGeoRedirected) {
            history.replace({ search }, null);
        }

        setIsRedirectCompleted(true);
    }, [
        storeCodeInUrl,
        currentStoreCode,
        setStorageStoreCode,
        defaultHostname,
        isDefaultHostname,
        defaultStore.code,
        location.hostname,
        pathname,
        search,
        history,
        setIsRedirectCompleted,
        isGeoRedirected,
        location
    ]);

    return null;
};

export default StoreCodeRoute;
