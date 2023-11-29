import { useCallback, useState } from 'react';

import { storeViewsForDomain } from '@app/util/storeViewForDomain';

export const useStoreCodeInUrl = () => {
    const [storeCode, setStoreCode] = useState(null);

    const storeCodeInUrl = useCallback(() => {
        // Get available store views for current domain
        const storeCodes = [];
        const availableStoreViews = storeViewsForDomain();
        availableStoreViews.forEach(store => storeCodes.push(store.code));

        // Sort by length (longest first) to avoid false hits ie "en" matching just
        // The "/en" in "/en-us/home.html" when "en-us" is also in storeCodes.
        storeCodes.sort((a, b) => b.length - a.length);

        // Find the store code in the url. This will always be the first path.
        // I.e. `https://example.com/fr/foo/baz.html` => `fr`.
        const regex = new RegExp(`^/(${storeCodes.join('|')})`, 'g');
        const { location } = globalThis;
        const { pathname } = location;
        const match = location && pathname.match(regex);

        // Set the current store code from the path.
        if (match && match[0].replace(/\//g, '')) {
            setStoreCode(match[0].replace(/\//g, ''));
        }

        // Return if store code is in the URL.
        return match && match[0].replace(/\//g, '');
    }, []);

    return {
        storeCode,
        storeCodeInUrl
    };
};
