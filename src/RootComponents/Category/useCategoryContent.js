import { useLazyQuery, useQuery } from '@apollo/client';
import { merge } from 'lodash';
import { useEffect, useCallback, useState } from 'react';

import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/RootComponents/Category/categoryContent.gql.js';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

/**
 * Returns props necessary to render the categoryContent component.
 *
 * @param {object} props.data - The results of a getCategory GraphQL query.
 *
 * @returns {object} result
 * @returns {string} result.categoryDescription - This category's description.
 * @returns {string} result.categoryName - This category's name.
 * @returns {object} result.filters - The filters object.
 * @returns {object} result.items - The items in this category.
 * @returns {number} result.totalPagesFromData - The total amount of pages for the query.
 */
export const useCategoryContent = props => {
    const {
        categoryId,
        data,
        initialProductsData,
        additionalProducts,
        currentPage,
        pageSize = 6,
        setPage,
        showMoreRef
    } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { getCategoryContentQuery, getProductFiltersByCategoryQuery } = operations;

    const placeholderItems = Array.from({ length: pageSize }).fill(null);

    const [getFilters, { data: filterData }] = useLazyQuery(getProductFiltersByCategoryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { data: categoryData } = useQuery(getCategoryContentQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !categoryId,
        variables: {
            id: categoryId
        }
    });

    useEffect(() => {
        if (categoryId) {
            getFilters({
                variables: {
                    categoryIdFilter: {
                        eq: categoryId
                    }
                }
            });
        }
    }, [categoryId, getFilters]);

    const filters = filterData ? filterData.products.aggregations : null;
    const items = data ? merge([], [...initialProductsData, ...additionalProducts]) : placeholderItems;
    const totalPagesFromData = data ? data.products.page_info.total_pages : null;
    const totalCount = data ? data.products.total_count : null;
    const categoryName = categoryData ? categoryData.category.name : null;
    const categoryDescription = categoryData ? categoryData.category.description : null;

    // Stores initial scroll position when category page is opened.
    const [initialScrollPosition, setInitialScrollPosition] = useState(globalThis.scrollY);

    const scrollHandler = useCallback(() => {
        // Prevent loading additional pages until page hasn't scrolled to the top when switching between categories.
        if (initialScrollPosition) {
            if (!globalThis.scrollY) {
                setInitialScrollPosition(0);
            }
            return;
        }

        // ScrollY - scrolled pixels from top, initial 0
        // InnerHeight - viewport height
        // OffsetTop - pixels from the top of nearest relatively positioned parent (categoryPage -> gallery)
        if (showMoreRef.current && globalThis.scrollY + globalThis.innerHeight >= showMoreRef.current.offsetTop) {
            setPage(currentPage + 1);
        }
    }, [currentPage, setPage, showMoreRef, initialScrollPosition]);

    // Set the initial scroll position to where previous category was left off when switching.
    useEffect(() => {
        setInitialScrollPosition(globalThis.scrollY);
    }, [categoryId]);

    useEffect(() => {
        globalThis.addEventListener('scroll', scrollHandler);
        return () => globalThis.removeEventListener('scroll', scrollHandler);
    }, [scrollHandler]);

    return {
        categoryName,
        categoryDescription,
        filters,
        items,
        totalCount,
        totalPagesFromData
    };
};
