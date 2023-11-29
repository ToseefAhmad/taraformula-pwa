import { useCallback, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useIntl } from 'react-intl';

import { useStores } from '@app/hooks/useStores/useStores';
import { getDefaultHostname } from '@app/util/storeViewForDomain';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();

const STORE_SET_COOKIE = 'cookie_store_set';
const GEO_IP_COOKIE = 'geo-ip-redirect-success';
const CUSTOMER_LOCATION_COOKIE = 'customer-location';

/**
 * @returns {{selectedCountry: string, handleSubmit: ((function(): void)|*), handleLanguageSwitch: ((function(*): void)|*), selectedLanguage: string, handleClosePopUp: ((function(): void)|*), dropDownClick: ((function(*): void)|*), stores: unknown[], availableLanguages: *[], handleStoreSwitch: ((function(*): void)|*), openDropDown: string, isHidden: boolean}}
 */
export const useGeoIpPopUp = () => {
    const { formatMessage } = useIntl();
    const isStoreCodeSet = !!storage.getItem('store_view_code');
    const { isDefaultHostname } = getDefaultHostname();

    const {
        handleSwitchStore,
        defaultStores,
        storeGroups,
        currentGroupStores,
        currentStoreCode,
        availableStores,
        browserLanguage
    } = useStores();
    const [cookies, setOriginalCookie] = useCookies();
    const [openDropDown, setOpenDropDown] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');

    let customerLocation = 'us';

    if (cookies[CUSTOMER_LOCATION_COOKIE] !== undefined) {
        customerLocation = cookies[CUSTOMER_LOCATION_COOKIE];
    }

    const isUsLocation = customerLocation === 'us' ? true : customerLocation === 'usa';

    // Make sure that something is in array in order to disable shimmer
    const [availableLanguages, setAvailableLanguages] = useState(['']);

    // Close PopUp and set cookie in order not show popUp again
    const handleClosePopUp = useCallback(() => {
        setOriginalCookie(STORE_SET_COOKIE, 1, {
            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        });
    }, [setOriginalCookie]);

    const handleCloseDropDown = useCallback(() => {
        setOpenDropDown('');
    }, [setOpenDropDown]);

    const dropDownClick = useCallback(
        element => {
            if (openDropDown !== element) {
                setOpenDropDown(element);
            } else {
                handleCloseDropDown();
            }
        },
        [openDropDown, handleCloseDropDown]
    );

    const handleStoreSwitch = useCallback(
        store => {
            setSelectedCountry(store);

            // Set Languages
            const languages = [];
            store &&
                storeGroups.forEach(group => {
                    group.map(lang => {
                        if (lang.storeGroupCode === store.storeGroupCode) {
                            languages.push({
                                key: lang.code,
                                value: lang.code,
                                label: formatMessage({
                                    id: 'storeName.' + lang.code,
                                    defaultMessage: lang.storeName
                                })
                            });
                        }
                    });
                });
            // Set values
            setAvailableLanguages(languages);
            setSelectedLanguage(languages.length > 0 ? languages[0] : '');
            handleCloseDropDown();
        },
        [setSelectedLanguage, storeGroups, formatMessage, handleCloseDropDown]
    );

    const handleLanguageSwitch = useCallback(
        store => {
            setSelectedLanguage(store);
            handleCloseDropDown();
        },
        [setSelectedLanguage, handleCloseDropDown]
    );

    // Handle form and select chosen store
    const handleSubmit = useCallback(() => {
        if (selectedLanguage.value === currentStoreCode) {
            handleClosePopUp();
        } else {
            availableStores.forEach(store => {
                if (store.code === selectedLanguage.value && store.code !== currentStoreCode) {
                    handleSwitchStore(store);
                } else {
                    handleClosePopUp();
                }
            });
        }
    }, [selectedLanguage.value, currentStoreCode, handleClosePopUp, handleSwitchStore, availableStores]);

    const stores = defaultStores
        .map(
            store =>
                store && {
                    key: store.code,
                    value: store.code,
                    label: formatMessage({
                        id: 'storeName.' + store.code,
                        defaultMessage: store.storeGroupName
                    }),
                    storeGroupCode: store.storeGroupCode
                }
        )
        .filter(Boolean);

    // Find store by browser language. E.g. if browser language is Arabic, find Arabic store in current store groups.
    const storeByBrowserLanguage = useMemo(() => {
        let storeByBrowserLanguage = null;

        if (browserLanguage) {
            currentGroupStores.forEach(store => {
                const locale = store.locale.split('_');

                if (locale[0] === browserLanguage) {
                    storeByBrowserLanguage = store;
                }
            });
        }

        return storeByBrowserLanguage;
    }, [currentGroupStores, browserLanguage]);

    // Select Default store view and language
    useMemo(() => {
        if (storeByBrowserLanguage) {
            handleStoreSwitch({
                key: storeByBrowserLanguage.code,
                value: storeByBrowserLanguage.code,
                label: storeByBrowserLanguage.storeGroupName,
                storeGroupCode: storeByBrowserLanguage.storeGroupCode
            });
            setSelectedLanguage({
                key: storeByBrowserLanguage.locale,
                value: storeByBrowserLanguage.code,
                label: storeByBrowserLanguage.storeName
            });
        } else {
            currentGroupStores.forEach(store => {
                if (store.isCurrent) {
                    handleStoreSwitch({
                        key: store.code,
                        value: store.code,
                        label: store.storeGroupName,
                        storeGroupCode: store.storeGroupCode
                    });
                    setSelectedLanguage({
                        key: store.locale,
                        value: store.code,
                        label: store.storeName
                    });
                }
            });
        }
    }, [currentGroupStores, setSelectedLanguage, handleStoreSwitch, storeByBrowserLanguage]);

    return {
        isHidden:
            isStoreCodeSet ||
            !isDefaultHostname ||
            !!cookies[STORE_SET_COOKIE] ||
            !!cookies[GEO_IP_COOKIE] ||
            isUsLocation,
        handleSubmit,
        handleClosePopUp,
        handleLanguageSwitch,
        handleStoreSwitch,
        stores,
        availableLanguages,
        selectedLanguage,
        selectedCountry,
        dropDownClick,
        openDropDown,
        handleCloseDropDown
    };
};
