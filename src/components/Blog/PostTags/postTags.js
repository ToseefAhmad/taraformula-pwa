import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';
import { getURL } from '@amasty/blog-pro/src/utils';
import { bool, string } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import classes from '@app/components/Blog/blog.module.css';
import { useAmBlogProContext } from '@app/components/Blog/context';

const PostTags = ({ tagIds, isCustomStyling = false }) => {
    const { getTagsByIds } = useAmBlogProContext();
    const tags = getTagsByIds(tagIds);

    if (!tags || !tags.length) {
        return null;
    }

    const tagList = tags.map(({ tag_id, url_key, name }) => (
        <Link key={tag_id} className={classes.tagsItem} to={getURL(BLOG_URLS_BY_SECTION.TAG, url_key)} title={name}>
            <span className={classes.tagName}>{name}</span>
        </Link>
    ));

    return <div className={isCustomStyling ? classes.customTags : classes.tags}>{tagList}</div>;
};

PostTags.propTypes = {
    tagIds: string,
    isCustomStyling: bool
};

PostTags.defaultProps = {
    tagIds: ''
};

export default PostTags;
