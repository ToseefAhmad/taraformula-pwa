import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../FeaturedPosts/featuredPosts.css';
import { BLOG_URLS_BY_SECTION } from '../../constants';
import { getURL, formatDate } from '../../utils';
import { Link } from 'react-router-dom';
import Image from '@magento/venia-ui/lib/components/Image';
import { useAmBlogProContext } from '../../context';
import { func, string } from 'prop-types';

const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 270;

const Post = props => {
  const { settings } = useAmBlogProContext();

  const {
    url_key,
    post_thumbnail: postThumbnail,
    list_thumbnail: listThumbnail,
    post_thumbnail_alt: postThumbnailAlt,
    title,
    published_at: date,
    onClickCapture
  } = props;

  const classes = mergeClasses(defaultClasses, props.classes);
  const url = getURL(BLOG_URLS_BY_SECTION.POST, url_key);
  const imgSrc = listThumbnail || postThumbnail;
  const { post_image_width, post_image_height } = settings || {};

  const imgWidth = post_image_width || IMAGE_WIDTH;
  const imgHeight = post_image_height || IMAGE_HEIGHT;

  const imgContainerStyle = {
    paddingTop: `${(imgHeight / imgWidth) * 100}%`
  };

  return (
    <div className={classes.post} onClickCapture={onClickCapture}>
      <Link
        className={classes.images}
        to={url}
        title={title}
        style={imgContainerStyle}
      >
        <Image
          alt={postThumbnailAlt}
          classes={{
            image: classes.image,
            root: classes.imageContainer
          }}
          src={`/${imgSrc.replace(/^\//, '')}`}
          width={imgWidth}
          height={imgWidth}
        />
      </Link>

      <Link to={url} title={title}>
        <h3 className={classes.postTitle}>{title}</h3>
      </Link>

      <div className={classes.date}>{formatDate(date)}</div>

      <div className={classes.footer}>
        <Link className={classes.more} to={url} title={'Read more'}>
          <span>Read more</span>
        </Link>
      </div>
    </div>
  );
};

Post.propTypes = {
  url_key: string,
  post_thumbnail: string,
  list_thumbnail: string,
  post_thumbnail_alt: string,
  title: string,
  onClickCapture: func
};

export default Post;
