import { useLazyQuery } from '@apollo/client';
import { useEffect, useLayoutEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { GET_POST } from '@app/components/Blog/queries/getPost.ggl.js';
import { BLOG_POST_PAGE, useBlogHreflangs } from '@app/components/Blog/useBlogHreflangs';

export const usePost = ({ commentsRef }) => {
    const location = useLocation();
    const { slug, previewKey } = useParams();
    const [runQuery, queryResponse] = useLazyQuery(GET_POST, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const { loading = true, error, data } = queryResponse;

    const postId = (data && data.amBlogPost && data.amBlogPost.post_id) || null;
    const blogHreflangs = useBlogHreflangs(location.pathname, postId, BLOG_POST_PAGE);

    useEffect(() => {
        const variables = {
            urlKey: slug,
            previewKey: previewKey
        };
        runQuery({ variables });

        window.scrollTo({
            left: 0,
            top: 0
        });
    }, [slug, previewKey, runQuery]);

    useLayoutEffect(() => {
        const { current: el } = commentsRef;

        if (el && location.hash.includes('#comments')) {
            el.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'center'
            });
        }
    }, [commentsRef, location, data, loading, error]);

    const { amBlogPost } = data || {};

    return {
        loading,
        error,
        post: amBlogPost,
        blogHreflangs
    };
};
