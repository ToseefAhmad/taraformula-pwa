import { useLazyQuery, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import useTracking from '@app/hooks/useTracking/useTracking';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { usePagination } from '@magento/peregrine/lib/hooks/usePagination';
import { useSort } from '@magento/peregrine/lib/hooks/useSort';
import { getFiltersFromSearch, getFilterInput } from '@magento/peregrine/lib/talons/FilterModal/helpers';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './category.gql';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 * controls the logic for the Category Root Component.
 *
 * @kind function
 *
 * @param {object}      props
 * @param {number}      props.id - Category Id.
 * @param {GraphQLAST}  props.operations.getCategoryQuery - Fetches category using a server query
 * @param {GraphQLAST}  props.operations.getFilterInputsQuery - Fetches "allowed" filters using a server query
 * @param {GraphQLAST}  props.queries.getStoreConfig - Fetches store configuration using a server query
 *
 * @returns {object}    result
 * @returns {object}    result.error - Indicates a network error occurred.
 * @returns {object}    result.categoryData - Category data.
 * @returns {bool}      result.isLoading - Category data loading.
 * @returns {string}    result.metaDescription - Category meta description.
 * @returns {object}    result.pageControl - Category pagination state.
 * @returns {array}     result.sortProps - Category sorting parameters.
 * @returns {number}    result.pageSize - Category total pages.
 */
export const useCategory = props => {
    const {
        id,
        queries: { getPageSize }
    } = props;
    const { getProductCategories, trackProductImpression } = useTracking();

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCategoryQuery, getFilterInputsQuery } = operations;

    const { data: pageSizeData } = useQuery(getPageSize, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const pageSize = pageSizeData && pageSizeData.storeConfig.grid_per_page;

    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const sortProps = useSort();
    const [currentSort] = sortProps;

    // Keep track of the sort criteria so we can tell when they change.
    const previousSort = useRef(currentSort);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const handleTracking = useCallback(
        data => {
            if (data.products && data.products.items.length) {
                const currencyCode = data.products.items[0].price_range.maximum_price.final_price.currency;
                trackProductImpression({
                    currencyCode,
                    list: 'Category Page',
                    products: data.products.items.map((product, index) => ({
                        sku: product.sku,
                        price: product.price_range.maximum_price.final_price.value,
                        category: product.categories ? getProductCategories(product.categories) : '',
                        position: index + 1,
                        name: product.name,
                        quantity: 1
                    }))
                });
            }
        },
        [getProductCategories, trackProductImpression]
    );

    const [runQuery, queryResponse] = useLazyQuery(getCategoryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        onCompleted: data => {
            handleTracking(data);
        }
    });
    const { called: categoryCalled, loading: categoryLoading, error, data } = queryResponse;
    const initialProductsData = data && data.products ? data.products.items : [];

    const { search } = useLocation();

    const isBackgroundLoading = !!data && categoryLoading;

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    // Keep track of the search terms so we can tell when they change.
    const previousSearch = useRef(search);

    // Get "allowed" filters by intersection of schema and aggregations
    const { called: introspectionCalled, data: introspectionData, loading: introspectionLoading } = useQuery(
        getFilterInputsQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    // Create a type map we can reference later to ensure we pass valid args
    // To the graphql query.
    // For example: { category_id: 'FilterEqualTypeInput', price: 'FilterRangeTypeInput' }
    const filterTypeMap = useMemo(() => {
        const typeMap = new Map();
        if (introspectionData) {
            introspectionData.__type.inputFields.forEach(({ name, type }) => {
                typeMap.set(name, type.name);
            });
        }
        return typeMap;
    }, [introspectionData]);

    // Run the category query immediately and whenever its variable values change.
    useEffect(() => {
        // Wait until we have the type map to fetch product data.
        if (!filterTypeMap.size || !pageSize) {
            return;
        }

        const filters = getFiltersFromSearch(search);

        // Construct the filter arg object.
        const newFilters = {};
        filters.forEach((values, key) => {
            newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
        });

        // Use the category id for the current category page regardless of the
        // Applied filters. Follow-up in PWA-404.
        newFilters['category_id'] = { eq: String(id) };

        runQuery({
            variables: {
                currentPage: 1,
                id: Number(id),
                filters: newFilters,
                pageSize: Number(pageSize),
                sort: { [currentSort.sortAttribute]: currentSort.sortDirection }
            }
        });
    }, [currentSort, filterTypeMap, id, pageSize, runQuery, search]);

    const totalPagesFromData = data ? data.products.page_info.total_pages : null;

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    // Hold any products past the first page.
    const [additionalProducts, setAdditionalProducts] = useState([]);

    // Holds products per page.
    const [additionalProductsPerPage, setAdditionalProductsPerPage] = useState({});

    // Keep track of loaded pages.
    const [loadedPage, setLoadedPage] = useState(1);

    // Handle new page load.
    const handlePageLoad = useCallback(
        data => {
            if (data && data.products.items) {
                const newProductsPerPage = {
                    ...additionalProductsPerPage,
                    [data.products.page_info.current_page]: data.products.items
                };

                setAdditionalProductsPerPage(newProductsPerPage);
                setAdditionalProducts(Object.values(newProductsPerPage).flat());

                setLoadedPage(data.products.page_info.current_page);
            }
        },
        [additionalProductsPerPage]
    );

    // Fetch new products if page size is increased.
    const [fetchAdditionalProducts] = useLazyQuery(getCategoryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        onCompleted: data => {
            handlePageLoad(data);
            handleTracking(data);
        }
    });

    // Each time page is increased, load its products.
    useEffect(() => {
        if (currentPage > 1 && currentPage <= totalPagesFromData && loadedPage < currentPage) {
            const filters = getFiltersFromSearch(search);

            // Construct the filter arg object.
            const newFilters = {};
            filters.forEach((values, key) => {
                newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
            });

            // Use the category id for the current category page regardless of the
            // Applied filters. Follow-up in PWA-404.
            newFilters['category_id'] = { eq: String(id) };

            fetchAdditionalProducts({
                variables: {
                    currentPage: currentPage,
                    id: Number(id),
                    filters: newFilters,
                    pageSize: Number(pageSize),
                    sort: { [currentSort.sortAttribute]: currentSort.sortDirection }
                }
            });
        }
    }, [
        currentPage,
        fetchAdditionalProducts,
        filterTypeMap,
        id,
        pageSize,
        loadedPage,
        totalPagesFromData,
        search,
        currentSort.sortAttribute,
        currentSort.sortDirection
    ]);

    // If we get an error after loading we should try to reset to page 1.
    // If we continue to have errors after that, render an error message.
    useEffect(() => {
        if (error && !categoryLoading && !data && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, error, categoryLoading, setCurrentPage, data]);

    // Reset the current page back to one (1) when the search string, filters
    // Or sort criteria change.
    useEffect(() => {
        // We don't want to compare page value.
        const prevSearch = new URLSearchParams(previousSearch.current);
        const nextSearch = new URLSearchParams(search);
        prevSearch.delete('page');
        nextSearch.delete('page');

        if (
            prevSearch.toString() !== nextSearch.toString() ||
            previousSort.current.sortAttribute.toString() !== currentSort.sortAttribute.toString() ||
            previousSort.current.sortDirection.toString() !== currentSort.sortDirection.toString()
        ) {
            // The search term changed.
            setCurrentPage(1, true);
            // And update the ref.
            previousSearch.current = search;
            previousSort.current = currentSort;
        }
    }, [currentSort, previousSearch, search, setCurrentPage]);

    const categoryData = categoryLoading && !data ? null : data;

    const metaTitle = data && data.category && data.category.meta_title ? data.category.meta_title : '';
    const canonicalUrlFull =
        data && data.category && data.category.canonical_full_url ? data.category.canonical_full_url : '';

    const metaDescription =
        data && data.category && data.category.meta_description ? data.category.meta_description : '';

    // When only categoryLoading is involved, noProductsFound component flashes for a moment
    const loading = (introspectionCalled && !categoryCalled) || (categoryLoading && !data) || introspectionLoading;

    return {
        error,
        categoryData,
        initialProductsData,
        additionalProducts,
        loading,
        metaTitle,
        metaDescription,
        pageControl,
        sortProps,
        pageSize,
        canonicalUrlFull
    };
};
