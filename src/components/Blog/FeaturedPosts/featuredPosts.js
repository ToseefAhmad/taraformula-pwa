import { useQuery } from '@apollo/client';
import { number } from 'prop-types';
import React, { useState, useCallback } from 'react';
import Slider from 'react-slick';

import { GET_FEATURED_POSTS } from '@app/components/Blog/queries/featuredPostsWidget.ggl.js';

import { carouselSettings } from './carousel';
import classes from './featuredPosts.module.css';
import FeaturedPostsShimmer from './featuredPosts.shimmer';
import Post from './post';

const FeaturedPosts = ({ widgetId }) => {
    const [dragging, setDragging] = useState(false);
    const handleBeforeChange = useCallback(() => {
        setDragging(true);
    }, [setDragging]);

    const handleAfterChange = useCallback(() => {
        setDragging(false);
    }, [setDragging]);

    const { loading, error, data } = useQuery(GET_FEATURED_POSTS, {
        fetchPolicy: 'cache-and-network',
        variables: {
            id: widgetId
        }
    });

    if (error) {
        return null;
    }

    const { amBlogFeaturedPostsWidget } = data || {};
    const { items } = amBlogFeaturedPostsWidget || {};

    if (!items || !items.length) {
        return null;
    }

    const posts = items.map(item => (
        <Post dragging={dragging} style={{ width: '63vw' }} key={item.post_id} {...item} />
    ));
    const sliderSettings = { ...carouselSettings, infinite: items.length > 3 };
    const sliderContent = loading ? (
        <FeaturedPostsShimmer />
    ) : (
        <Slider beforeChange={handleBeforeChange} afterChange={handleAfterChange} {...sliderSettings}>
            {posts}
        </Slider>
    );

    return (
        <div className={classes.root}>
            <div className={classes.carouselFeatured}>{sliderContent}</div>
        </div>
    );
};

FeaturedPosts.propTypes = {
    widgetId: number
};

FeaturedPosts.defaultProps = {
    widgetId: 0
};

export default FeaturedPosts;
