import { PAGE_TYPES } from '@amasty/blog-pro/src/constants';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAmBlogProContext } from '@app/components/Blog/context';
import { GET_POSTS } from '@app/components/Blog/queries/getPosts.ggl.js';
import { usePagination } from '@magento/peregrine';

const DEFAULT_PAGE_SIZE = 8; // Count post per page

export const useList = ({ id }) => {
    const { settings, pageType } = useAmBlogProContext();
    const isSearch = pageType === PAGE_TYPES.SEARCH;
    // Const { list_count_per_page: pageSize = DEFAULT_PAGE_SIZE } = settings; <- not working correctly on page hard refresh
    const pageSize = settings && 'list_count_per_page' in settings ? settings.list_count_per_page : DEFAULT_PAGE_SIZE;
    const [runQuery, queryResponse] = useLazyQuery(GET_POSTS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const { loading, error, data, called } = queryResponse;
    const location = useLocation();
    const { amBlogPosts, amBlogPostsSearch } = data || {};
    const { last_post = [], items = [], total_divided_by_visible: totalDividedByVisible } =
        amBlogPosts || amBlogPostsSearch || {};
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;
    const baseUrl = amBlogPosts && amBlogPosts.base_url ? amBlogPosts.base_url : null;

    useEffect(() => {
        // Set total pages to totalDividedByVisible, so that show more is hidden when no more posts available
        setTotalPages(totalDividedByVisible);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalDividedByVisible, pageSize]);

    useEffect(() => {
        if (error && !loading && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, error, loading, setCurrentPage]);

    useEffect(() => {
        const variables = {
            page: Number(currentPage),
            type: pageType,
            entityId: id
        };

        runQuery({ variables });
    }, [id, pageType, isSearch, currentPage, pageSize, runQuery, location]);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    return {
        loading: loading || !called,
        error,
        data,
        last_post,
        items,
        pageControl,
        baseUrl
    };
};
