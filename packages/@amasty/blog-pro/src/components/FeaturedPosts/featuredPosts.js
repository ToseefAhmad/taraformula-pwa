import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './featuredPosts.css';
import { number, string } from 'prop-types';
import { useQuery } from '@apollo/client';
import GET_FEATURED_POSTS from '../../queries/featuredPostsWidget.graphql';
import Post from './post';
import SlickSlider from 'react-slick';
import { carouselSettings } from './carousel';

const FeaturedPosts = props => {
  const { widgetId, title } = props;

  const { loading, error, data } = useQuery(GET_FEATURED_POSTS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      id: widgetId
    }
  });

  if (loading || error) {
    return null;
  }

  const { amBlogFeaturedPostsWidget } = data || {};
  const { items } = amBlogFeaturedPostsWidget || {};

  if (!items || !items.length) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const posts = items.map(item => <Post key={item.post_id} {...item} />);

  const sliderSettings = { ...carouselSettings, infinite: items.length > 3 };

  return (
    <div className={classes.root}>
      <div className={classes.title}>{title}</div>
      <div className={classes.carousel}>
        <SlickSlider {...sliderSettings}>{posts}</SlickSlider>
      </div>
    </div>
  );
};

FeaturedPosts.propTypes = {
  widgetId: number,
  title: string
};

FeaturedPosts.defaultProps = {
  widgetId: 0,
  title: 'Featured Posts'
};

export default FeaturedPosts;
