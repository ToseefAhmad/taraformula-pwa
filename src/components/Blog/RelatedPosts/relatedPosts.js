import GET_POSTS_BY_IDS from '@amasty/blog-pro/src/queries/getPostsByIds.graphql';
import { useQuery } from '@apollo/client';
import { bool, string } from 'prop-types';
import React from 'react';

import { useScreenSize } from '@app/hooks/useScreenSize';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import Post from './post';
import classes from './relatedPosts.module.css';

const RelatedPosts = ({ relatedPostIds, title, loadingMainPage }) => {
    // Convert to array and limit to 3 posts
    const ids = relatedPostIds
        .toString()
        .split(',')
        .slice(0, 3)
        .filter(element => element !== '');
    const { isMobileScreen } = useScreenSize();
    const { loading, error, data } = useQuery(GET_POSTS_BY_IDS, {
        variables: {
            ids
        },
        skip: !ids || !ids.length
    });

    if (error) {
        return null;
    }

    const { amBlogPostsByIds } = data || {};
    const { items } = amBlogPostsByIds || {};

    if (!items || !items.length) {
        return null;
    }

    const relatedTitleContent = loadingMainPage ? (
        <Shimmer width={'250px'} height={'46px'} />
    ) : (
        <h1 className={classes.title}>{title}</h1>
    );

    const posts = items.map(item => <Post key={item.post_id} {...item} />);
    const relatedPostContent =
        loadingMainPage || loading ? (
            <div className={classes.related}>
                <Shimmer width={'100%'} height={isMobileScreen ? '343px' : '500px'} />
                <Shimmer width={'100%'} height={isMobileScreen ? '343px' : '500px'} />
                <Shimmer width={'100%'} height={isMobileScreen ? '343px' : '500px'} />
            </div>
        ) : (
            <div className={classes.related}>{posts}</div>
        );

    return (
        <div className={classes.root}>
            {relatedTitleContent}
            {relatedPostContent}
        </div>
    );
};

RelatedPosts.propTypes = {
    relatedPostIds: string,
    title: string,
    loading: bool,
    loadingMainPage: bool
};

export default RelatedPosts;
