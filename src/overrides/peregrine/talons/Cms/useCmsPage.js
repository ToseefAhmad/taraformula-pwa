import { useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { getDirection, Directions } from '@app/hooks/useDirection';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './cmsPage.gql';

const ltrPathnames = ['privacy-policy', 'terms-and-conditions', 'cookie-policy'];

/**
 * Retrieves data necessary to render a CMS Page
 *
 * @param {object} props
 * @param {object} props.id - CMS Page ID
 * @param {object} props.queries - Collection of GraphQL queries
 * @param {object} props.queries.getCmsPage - Query for getting a CMS Page
 * @returns {{shouldShowLoadingIndicator: *, hasContent: *, cmsPage: *, error: *}}
 */
export const useCmsPage = props => {
    const { identifier } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCMSPageQuery } = operations;

    const [showLtr, setShowLtr] = useState(false);

    const { loading, error, data } = useQuery(getCMSPageQuery, {
        variables: {
            identifier: identifier
        },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    // To prevent loading indicator from getting stuck, unset on unmount.
    useEffect(() => {
        return () => {
            setPageLoading(false);
        };
    }, [setPageLoading]);

    // Ensure we mark the page as loading while we check the network for updates
    useEffect(() => {
        setPageLoading(loading);
    }, [loading, setPageLoading]);

    const shouldShowLoadingIndicator = loading && !data;

    const cmsPage = data ? data.cmsPage : null;
    const rootCategoryId = data ? data.storeConfig.root_category_id : null;

    // Only render <RichContent /> if the page isn't empty and doesn't contain
    // The default CMS Page text. We do this so there is at least a useable home
    // Page by default, the category list component.
    const hasContent = useMemo(() => {
        return (
            cmsPage &&
            cmsPage.content &&
            cmsPage.content.length > 0 &&
            !cmsPage.content.includes('CMS homepage content goes here.')
        );
    }, [cmsPage]);

    const { pathname } = useLocation();

    useEffect(() => {
        if (getDirection() === Directions.rtl && ltrPathnames.includes(pathname.replace('/', ''))) {
            setShowLtr(true);
        }
    }, [pathname]);

    return {
        cmsPage,
        error,
        hasContent,
        rootCategoryId,
        shouldShowLoadingIndicator,
        loading,
        showLtr
    };
};
