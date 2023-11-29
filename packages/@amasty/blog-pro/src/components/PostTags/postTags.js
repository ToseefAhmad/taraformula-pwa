import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../PostPage/post.css';
import { useAmBlogProContext } from '../../context';
import { Link } from 'react-router-dom';
import { string } from 'prop-types';
import { BLOG_URLS_BY_SECTION } from '../../constants';
import { getURL } from '../../utils';

const PostTags = props => {
  const { tagIds } = props;
  const classes = mergeClasses(defaultClasses, props.classes);
  const { getTagsByIds } = useAmBlogProContext();
  const tags = getTagsByIds(tagIds);

  if (!tags || !tags.length) {
    return null;
  }

  const tagList = tags.map(({ tag_id, url_key, name }) => (
    <Link
      key={tag_id}
      className={classes.tagsItem}
      to={getURL(BLOG_URLS_BY_SECTION.TAG, url_key)}
      title={name}
    >
      {name}
    </Link>
  ));

  return <div className={classes.tags}>{tagList}</div>;
};

PostTags.propTypes = {
  tagIds: string
};

PostTags.defaultProps = {
  tagIds: ''
};

export default PostTags;
