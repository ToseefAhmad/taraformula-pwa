import React, { Fragment } from 'react';
import { useLocation } from 'react-router-dom';

import classes from '@app/components/Blog/blog.module.css';
import { useAmBlogProContext } from '@app/components/Blog/context';
import FeaturedPosts from '@app/components/Blog/FeaturedPosts';
import HeroBlogPost from '@app/components/Blog/HeroBlogPost';
import List from '@app/components/Blog/List';
import { BLOG_HOME_PAGE, useBlogHreflangs } from '@app/components/Blog/useBlogHreflangs';
import Hreflangs from '@app/components/Hreflangs';
import { Meta, StoreTitle, Link } from '@magento/venia-ui/lib/components/Head';

// eslint-disable-next-line no-unused-vars
const HomePage = () => {
    const { settings, blogTitle } = useAmBlogProContext();
    const {
        search_engine_meta_title,
        search_engine_meta_description,
        search_engine_meta_keywords,
        canonical_full_url
    } = settings || {};

    const location = useLocation();
    const blogHreflangs = useBlogHreflangs(location.pathname, null, BLOG_HOME_PAGE);

    return (
        <Fragment>
            <Link rel="canonical" href={canonical_full_url} />
            <StoreTitle>{search_engine_meta_title || blogTitle}</StoreTitle>
            <Meta name="description" content={search_engine_meta_description} />
            <Meta name="keywords" content={search_engine_meta_keywords} />
            <Hreflangs hreflangs={blogHreflangs} />
            <HeroBlogPost />
            <div className={classes.featuredPosts}>
                <FeaturedPosts />
            </div>
            <List />
        </Fragment>
    );
};

export default HomePage;
