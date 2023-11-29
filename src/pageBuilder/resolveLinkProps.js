import { storeViewsForDomain } from '@app/util/storeViewForDomain';

/**
 * Resolve link properties
 *
 * @param {string} link
 */
export default link => {
    let isExternalUrl;
    const linkProps = {};
    const availableStoreViews = storeViewsForDomain();
    // Array from store codes
    const storeCodes = availableStoreViews.map(store => store.code);

    // Sort by length (longest first) to avoid false hits ie "en" matching just
    // The "/en" in "/en-us/home.html" when "en-us" is also in storeCodes.
    storeCodes.sort((a, b) => b.length - a.length);
    const regex = new RegExp(`^/(${storeCodes.join('|')})`, 'g');

    try {
        const urlObj = new URL(link, location.origin);
        isExternalUrl = location.hostname !== urlObj.hostname;

        if (isExternalUrl) {
            linkProps['href'] = link;
        } else {
            if (link.charAt(0) === '#') {
                linkProps['href'] = urlObj.hash;
            } else {
                let urlObjPathname = urlObj.pathname;
                const match = urlObj.pathname.match(regex);
                const storeCodeInUrl = match && match[0].replace(/\//g, '');

                if (storeCodeInUrl) {
                    urlObjPathname = urlObj.pathname.replace('/' + storeCodeInUrl, '');
                }

                linkProps['to'] = urlObjPathname + urlObj.hash;
            }
        }
    } catch (e) {
        linkProps['href'] = link;
    }

    return linkProps;
};
