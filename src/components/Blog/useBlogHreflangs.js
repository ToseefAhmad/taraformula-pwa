import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';

import { GET_HREFLANGS } from '@app/components/Blog/queries/getPost.ggl';

export const BLOG_POST_PAGE = 'blog_post_page';
export const BLOG_HOME_PAGE = 'blog_home_page';
export const useBlogHreflangs = (urlKey, entityId, pageType) => {
    const [runQuery, queryResponse] = useLazyQuery(GET_HREFLANGS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { data } = queryResponse;

    useEffect(() => {
        if (urlKey && pageType) {
            const variables = {
                urlKey: (typeof urlKey === 'string' && urlKey.substring(1)) || 'blog',
                pageType: pageType || BLOG_HOME_PAGE,
                entityId: entityId
            };

            runQuery({ variables });
        }
    }, [urlKey, runQuery, entityId, pageType]);

    return (data && data.blogHreflangs) || [];
};
