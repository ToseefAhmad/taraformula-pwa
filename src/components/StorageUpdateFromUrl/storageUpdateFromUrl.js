import { arrayOf, node, oneOfType } from 'prop-types';
import React from 'react';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import useStorageUpdateFromUrl from './useStorageUpdateFromUrl';

/**
 * This component checks if URL contains tokens and update storage.
 */
const StorageUpdateFromUrl = ({ children }) => {
    const { loading } = useStorageUpdateFromUrl();

    if (loading) {
        return <LoadingIndicator />;
    }

    return <>{children}</>;
};

export default StorageUpdateFromUrl;

StorageUpdateFromUrl.propTypes = {
    children: oneOfType([arrayOf(node), node])
};
