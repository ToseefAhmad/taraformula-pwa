import { setContentTypeConfig } from '@magento/pagebuilder/lib/config';

import { contentTypesConfig } from './config';

/**
 * Register new Page Builder components
 */
export const registerPageBuilder = () => {
    Object.keys(contentTypesConfig).forEach(contentKey => {
        setContentTypeConfig(contentKey, contentTypesConfig[contentKey]);
    });
};
