import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';
import { getURL } from '@amasty/blog-pro/src/utils';
import { shape, string } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import PostTags from '@app/components/Blog/PostTags';
import { getCorrectDateFormat } from '@app/components/Blog/time';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import Image from '@magento/venia-ui/lib/components/Image';

import classes from './post.module.css';

const Post = ({ post }) => {
    const {
        url_key,
        post_thumbnail: postThumbnail,
        list_thumbnail: listThumbnail,
        post_thumbnail_alt: postThumbnailAlt,
        tag_ids,
        title,
        published_at: date
    } = post;
    const url = getURL(BLOG_URLS_BY_SECTION.POST, url_key);
    const imgSrc = listThumbnail || postThumbnail || transparentPlaceholder;
    const formatDate = getCorrectDateFormat(date);

    return (
        <div className={classes.post}>
            {imgSrc && (
                <Link to={url} className={classes.images}>
                    <Image alt={postThumbnailAlt} src={imgSrc} width="100%" height="auto" />
                </Link>
            )}

            <div className={classes.content}>
                <Link title={title} to={url}>
                    <div className={classes.date}>{formatDate}</div>
                    <h2 className={classes.title}>{title}</h2>
                </Link>
                <PostTags tagIds={tag_ids} />
            </div>
        </div>
    );
};

Post.propTypes = {
    post: shape({
        url_key: string,
        post_thumbnail: string,
        list_thumbnail: string,
        post_thumbnail_alt: string,
        tag_ids: string,
        title: string,
        published_at: string
    })
};

export default Post;
