import { PAGE_TYPES } from '@amasty/blog-pro/src/constants';
import { number, string } from 'prop-types';
import React, { Fragment, useRef } from 'react';
import { Redirect } from 'react-router-dom';

import ListShimmer from '@app/components/Blog/List/list.shimmer';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useList } from '@app/talons/getLastPostedPost';
import { Link } from '@magento/venia-ui/lib/components/Head';
import Loader from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './list.module.css';
import Posts from './posts';

const List = ({ id }) => {
    const { isDesktopScreen } = useScreenSize();
    const { loading, error, items, pageControl, data } = useList({ id });
    const canonicalFullUrl = data ? data.amBlogPosts.canonical_url : null;

    const hasGrid = isDesktopScreen;
    const hasList = !isDesktopScreen;
    // Use Ref so that page is not reloaded on Show More
    const blogDataRef = useRef(null);

    if (items && items.length > 0) {
        blogDataRef.current = items;
    }

    if (error || (!loading && (!blogDataRef.current || !blogDataRef.current.length))) {
        return <Redirect to={'/404.html'} />;
    }

    const gridContent =
        loading && !blogDataRef.current ? (
            <ListShimmer />
        ) : (
            hasGrid && (
                <Posts items={blogDataRef.current} pageControl={pageControl} classes={{ layout: classes.gridRoot }} />
            )
        );

    const listContent =
        loading && !blogDataRef.current ? (
            <ListShimmer />
        ) : (
            hasList && (
                <Posts items={blogDataRef.current} pageControl={pageControl} classes={{ layout: classes.listRoot }} />
            )
        );

    return (
        <Fragment>
            {canonicalFullUrl ? <Link rel="canonical" href={canonicalFullUrl} /> : null}
            {gridContent}
            {listContent}
            {!blogDataRef.current || (loading && <Loader />)}
        </Fragment>
    );
};

List.propTypes = {
    pageType: string,
    id: number
};

List.defaultProps = {
    pageType: PAGE_TYPES.ALL
};

export default List;
