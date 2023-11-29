import { string } from 'prop-types';

import { useLocale } from '@app/hooks/useLocale/useLocale';

/**
 * This hook set lang="" attribute into <html> tag.s
 */
const useLanguage = propLanguage => {
    const { currentStoreLocale } = useLocale();
    if (propLanguage || currentStoreLocale) {
        document.documentElement.lang = propLanguage || currentStoreLocale.replace('_', '-');
    }
};

useLanguage.propTypes = {
    propLanguage: string
};

export default useLanguage;
