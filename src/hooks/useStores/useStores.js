import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';

import { URL_KEYS } from '@app/components/StorageUpdateFromUrl';
import { useStoreConfigContext } from '@app/context/StoreConfigContext/useStoreConfigContext';
import { defaultStoreViewForDomain } from '@app/util/storeViewForDomain';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { retrieveCartId } from '@magento/peregrine/lib/store/actions/cart';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

import {
    GET_URL_RESOLVER_DATA,
    GET_AVAILABLE_STORES_DATA,
    CREATE_ONE_TIME_TOKEN,
    GET_CART_TOTAL_QTY
} from './useStores.gql';

const storage = new BrowserPersistence();

const mapAvailableOptions = (config, stores) => {
    const { code: configCode } = config;

    return stores.reduce((map, store) => {
        const {
            category_url_suffix,
            code,
            default_display_currency_code: currency,
            locale,
            product_url_suffix,
            secure_base_url,
            secure_base_media_url,
            store_group_code: storeGroupCode,
            store_group_name: storeGroupName,
            store_name: storeName,
            store_sort_order: sortOrder
        } = store;

        const isCurrent = code === configCode;
        const option = {
            category_url_suffix,
            code,
            currency,
            isCurrent,
            locale,
            product_url_suffix,
            secure_base_url,
            secure_base_media_url,
            sortOrder,
            storeGroupCode,
            storeGroupName,
            storeName
        };

        return map.set(code, option);
    }, new Map());
};

/**
 * The useStoreSwitcher talon complements the StoreSwitcher component.
 *
 * @returns {Map}    talonProps.availableStores - Details about the available store views.
 * @returns {String}    talonProps.currentStoreName - Name of the current store view.
 * @returns {Boolean}   talonProps.storeMenuIsOpen - Whether the menu that this trigger toggles is open or not.
 * @returns {Ref}       talonProps.storeMenuRef - A React ref to the menu that this trigger toggles.
 * @returns {Ref}       talonProps.storeMenuTriggerRef - A React ref to the trigger element itself.
 * @returns {Function}  talonProps.handleTriggerClick - A function for handling when the trigger is clicked.
 * @returns {Function}  talonProps.handleSwitchStore - A function for handling when the menu item is clicked.
 */

export const useStores = () => {
    const { pathname } = useLocation();
    const [{ cartId }] = useCartContext();

    const { refetch: getCartTotal } = useQuery(GET_CART_TOTAL_QTY, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            cartId
        },
        skip: !cartId
    });

    const { storeConfigData } = useStoreConfigContext();

    const { data: urlResolverData } = useQuery(GET_URL_RESOLVER_DATA, {
        fetchPolicy: 'cache-first',
        variables: { url: pathname }
    });

    const { data: availableStoresData } = useQuery(GET_AVAILABLE_STORES_DATA, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [createOneTimeToken] = useMutation(CREATE_ONE_TIME_TOKEN);

    const currentStoreName = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.store_name;
        }
    }, [storeConfigData]);

    const currentGroupName = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.store_group_name;
        }
    }, [storeConfigData]);

    const currentStoreCode = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.code;
        }
    }, [storeConfigData]);

    const currentStoreGroupCode = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.store_group_code;
        }
    }, [storeConfigData]);

    const pageType = useMemo(() => {
        if (urlResolverData && urlResolverData.urlResolver) {
            return urlResolverData.urlResolver.type;
        }
    }, [urlResolverData]);

    // AvailableStores => mapped options or empty map if undefined.
    const availableStores = useMemo(() => {
        return (
            (storeConfigData &&
                availableStoresData &&
                mapAvailableOptions(storeConfigData.storeConfig, availableStoresData.availableStores)) ||
            new Map()
        );
    }, [storeConfigData, availableStoresData]);

    // Create a map of sorted store views for each group.
    const storeGroups = useMemo(() => {
        const groups = new Map();

        availableStores.forEach(store => {
            const groupCode = store.storeGroupCode;
            if (!groups.has(groupCode)) {
                const groupViews = [store];
                groups.set(groupCode, groupViews);
            } else {
                const groupViews = groups.get(groupCode);
                // Insert store at configured position
                groupViews.splice(store.sortOrder, 0, store);
            }
        });

        return groups;
    }, [availableStores]);

    // Get all available languages
    const supportedLanguages = useMemo(() => {
        const languages = [];
        storeGroups.forEach(group => {
            group.forEach(g => {
                const locale = g.locale.split('_');
                if (!languages.includes(locale[0])) {
                    languages.push(locale[0]);
                }
            });
        });
        return languages;
    }, [storeGroups]);

    const browserLang = window.navigator.userLanguage || window.navigator.language;

    // Get store language by browser language. If no language found, use English.
    const browserLanguage = useMemo(() => {
        const browserLanguageAsArray = browserLang ? browserLang.split('-') : null;
        if (browserLanguageAsArray) {
            const browserLanguageLocaleCode = browserLanguageAsArray[0];

            if (supportedLanguages.includes(browserLanguageLocaleCode)) {
                return browserLanguageLocaleCode;
            }
        }
        // Default language to which we will fall back if we don't have the store locale for the browser language.
        // E.g. if the browser language is Deutsch, simply choose English, because we don't have Deutsch store view.
        return 'en';
    }, [browserLang, supportedLanguages]);

    // Get list of stores
    const defaultStores = useMemo(() => {
        const stores = [];

        storeGroups.forEach(group => {
            let foundForBrowserLanguage = false;
            group.forEach(g => {
                const locale = g.locale.split('_');
                if (locale[0] === browserLanguage) {
                    foundForBrowserLanguage = true;
                    stores.push(g);
                }
            });
            // If there is no store for current browser language, simply take the first available store from website
            if (!foundForBrowserLanguage) {
                stores.push(group[0]);
            }
        });

        return stores;
    }, [storeGroups, browserLanguage]);

    const currentGroupStores = useMemo(() => {
        for (const group of storeGroups.values()) {
            for (const store of group.values()) {
                if (store.isCurrent) {
                    return group;
                }
            }
        }
        return [];
    }, [storeGroups]);

    // Get pathname with suffix based on page type
    const getPathname = useCallback(
        storeCode => {
            // Use globalThis.location.pathname to get the path with the store view code
            // Pathname from useLocation() does not include the store view code
            const pathname = globalThis.location.pathname;

            if (pageType === 'CATEGORY') {
                const currentSuffix = availableStores.get(currentStoreCode).category_url_suffix || '';
                const newSuffix = availableStores.get(storeCode).category_url_suffix || '';

                return currentSuffix ? pathname.replace(currentSuffix, newSuffix) : `${pathname}${newSuffix}`;
            }
            if (pageType === 'PRODUCT') {
                const currentSuffix = availableStores.get(currentStoreCode).product_url_suffix || '';
                const newSuffix = availableStores.get(storeCode).product_url_suffix || '';

                return currentSuffix ? pathname.replace(currentSuffix, newSuffix) : `${pathname}${newSuffix}`;
            }

            // Search.html ...etc
            return pathname;
        },
        [availableStores, currentStoreCode, pageType]
    );

    /**
     * Generate new path name base on current path name and store
     *
     * Structure:
     * Default website (defined in env.MAGENTO_BACKEND_URL)
     *  - taraformula.com
     *  It must always include store code, e.g.: taraformula.com/us-en/
     *
     * Secondary websites:
     *  - taraformula.ae
     *  - taraformula.qa
     *  - taraformula.kw
     *  These websites must NOT include store code for default store view.
     *  E.g.:
     *      - taraformula.kw/ (default store view)
     *      - taraformula.kw/kw-en/ (other store views)
     */
    const generatePathName = useCallback(
        (store, pathName, params) => {
            const urlParams = params.toString() ? '?' + params : '';
            const hostName = new URL(store.secure_base_url).hostname;
            const defaultStoreView = defaultStoreViewForDomain(hostName);

            // Handle updating the URL if the store code should be present
            if (process.env.USE_STORE_CODE_IN_URL === 'true') {
                // Check to see if we're on a page outside the homepage
                if (pathName !== '' && pathName !== '/') {
                    const [, pathStoreCode] = pathName.split('/');
                    let newPath = '';
                    // If the current store code is in the url, replace it with the new one
                    if (availableStores.has(pathStoreCode) && availableStores.get(pathStoreCode).isCurrent) {
                        if (
                            process.env.MAGENTO_BACKEND_URL === store.secure_base_url ||
                            defaultStoreView.code !== store.code
                        ) {
                            newPath += `/${pathName.replace(`/${pathStoreCode}`, `/${store.code}`)}`;
                        } else {
                            newPath += `/${pathName.replace(`/${pathStoreCode}`, ``)}`;
                        }

                        newPath += urlParams;
                    } else {
                        // Otherwise, include it and reload.
                        if (
                            process.env.MAGENTO_BACKEND_URL === store.secure_base_url ||
                            defaultStoreView.code !== store.code
                        ) {
                            newPath += `/${store.code}`;
                        }
                        newPath += `${pathName}${urlParams}`;
                    }

                    return newPath || '/';
                } else {
                    if (
                        process.env.MAGENTO_BACKEND_URL === store.secure_base_url ||
                        defaultStoreView.code !== store.code
                    ) {
                        return `/${store.code}${urlParams}`;
                    } else {
                        return `/${urlParams}`;
                    }
                }
            } else {
                // Refresh the page to re-trigger the queries once code/currency
                // Are saved in local storage.
                return `/${pathName}${urlParams}`;
            }
        },
        [availableStores]
    );

    const handleSwitchStore = useCallback(
        // Change store view code and currency to be used in Apollo link request headers
        async store => {
            // Do nothing when store view is not present in available stores
            if (!availableStores.has(store.code)) return;

            const hostName = new URL(store.secure_base_url).hostname;
            const pathName = getPathname(store.code);
            const params = new URLSearchParams(globalThis.location.search || '');

            // Add cart id only if cart is not empty
            const cartData = await getCartTotal();
            if (cartData && cartData.data && cartData.data.cart && cartData.data.cart.total_quantity > 0) {
                const retrievedCartId = await retrieveCartId();
                params.append(URL_KEYS.cartId, retrievedCartId);
            }

            // If customer switches store, save the cookie with new store code that will be used in Fastly Geoip redirects
            const cookies = new Cookies();
            cookies.set('store-switched', store.code, { path: '/' });
            cookies.remove('geo-ip-redirect', { path: '/' });

            let newPath = '';

            // Redirect to a different domain
            if (hostName !== location.hostname) {
                // Add signin token only if redirect to a different domain
                const signinToken = storage.getItem('signin_token');
                if (signinToken) {
                    const {
                        data: { createOneTimeToken: signinOneTimeToken }
                    } = await createOneTimeToken({
                        fetchPolicy: 'no-cache',
                        variables: {
                            value: signinToken
                        }
                    });

                    if (signinOneTimeToken) {
                        params.append(URL_KEYS.signinToken, signinOneTimeToken);
                    }
                }

                // Generate new path
                newPath = generatePathName(store, pathName, params).replace(/\/+/g, '/');

                // Remove first slash
                newPath = newPath.charAt(0) === '/' ? newPath.slice(1) : newPath;
                globalThis.location.assign(store.secure_base_url + newPath);
            } else {
                storage.setItem('store_view_code', store.code);
                storage.setItem('store_view_currency', availableStores.get(store.code).currency);
                storage.setItem(
                    'store_view_secure_base_media_url',
                    availableStores.get(store.code).secure_base_media_url
                );

                // Generate new path
                newPath = generatePathName(store, pathName, params).replace(/\/+/g, '/');

                // In this block we use `globalThis.location.assign` to work around the
                // Static React Router basename, which is changed on initialization.
                globalThis.location.assign(newPath);
            }
        },
        [availableStores, createOneTimeToken, generatePathName, getCartTotal, getPathname]
    );

    return {
        availableStores,
        currentGroupName,
        currentStoreName,
        currentGroupStores,
        storeGroups,
        handleSwitchStore,
        defaultStores,
        currentStoreCode,
        browserLanguage,
        currentStoreGroupCode
    };
};
