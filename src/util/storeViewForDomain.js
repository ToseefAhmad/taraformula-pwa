/**
 * There is no default store view for separate domains.
 * The first one is default.
 * Change order of magento websites in app/etc/config.php if you need to change the default one.
 * Change the store views "sort_order" to make specific store view to be first.
 *
 * Use STORE_VIEW_CODE to be default for default hostname
 */
export const defaultStoreViewForDomain = hostname => {
    const { isDefaultHostname } = getDefaultHostname(hostname);

    return AVAILABLE_STORE_VIEWS.find(store => {
        if (isDefaultHostname) {
            return store.code === STORE_VIEW_CODE;
        }
        return new URL(store.secure_base_url).hostname === (hostname || location.hostname);
    });
};

/**
 * Return array of stores for specific domain
 */
export const storeViewsForDomain = hostname => {
    return AVAILABLE_STORE_VIEWS.filter(store => {
        return new URL(store.secure_base_url).hostname === (hostname || location.hostname);
    });
};

/**
 * Get default host name and if currently it is default
 */
export const getDefaultHostname = hostname => {
    const defaultHostname = new URL(process.env.MAGENTO_BACKEND_URL).hostname;
    return {
        defaultHostname,
        isDefaultHostname: defaultHostname === (hostname || location.hostname)
    };
};
