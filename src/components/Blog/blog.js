import { PAGE_TYPES } from '@amasty/blog-pro/src/constants';
import React, { lazy, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import classes from './blog.module.css';
import AmBlogProProvider from './context';

const Home = lazy(() => import('./HomePage'));
const Post = lazy(() => import('./PostPage'));
const ListPage = lazy(() => import('./ListPage'));

const Blog = () => {
    const { slug, previewKey } = useParams();
    const isPostPage = (slug && !PAGE_TYPES[slug.toUpperCase()]) || previewKey;

    const Page = useMemo(() => {
        if (!slug && !previewKey) {
            return Home;
        }

        return slug && PAGE_TYPES[slug.toUpperCase()] && !previewKey ? ListPage : Post;
    }, [slug, previewKey]);

    return (
        <AmBlogProProvider>
            <article className={isPostPage ? classes.postPage : classes.root}>
                {isPostPage ? (
                    <Page />
                ) : (
                    <div className={classes.container}>
                        <Page />
                    </div>
                )}
            </article>
        </AmBlogProProvider>
    );
};

export default Blog;
