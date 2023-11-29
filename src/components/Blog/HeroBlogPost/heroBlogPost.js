import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';
import { getURL } from '@amasty/blog-pro/src/utils';
import { number } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import classes from '@app/components/Blog/blog.module.css';
import PostTags from '@app/components/Blog/PostTags';
import { getCorrectDateFormat } from '@app/components/Blog/time';
import { useList } from '@app/talons/getLastPostedPost';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import Image from '@magento/venia-ui/lib/components/Image';
import RichText from '@magento/venia-ui/lib/components/RichText';

import HeroBlogPostShimmer from './heroBlogPost.shimmer';

const HeroBlogPost = ({ id }) => {
    const { loading, last_post } = useList({ id });
    const {
        url_key,
        post_thumbnail: postThumbnail,
        list_thumbnail: listThumbnail,
        post_thumbnail_alt: postThumbnailAlt,
        tag_ids,
        title,
        short_content: shortContent,
        published_at: date
    } = last_post;

    const url = getURL(BLOG_URLS_BY_SECTION.POST, url_key);
    const imgSrc = listThumbnail || postThumbnail || transparentPlaceholder;
    const formatDate = getCorrectDateFormat(date);

    if (!loading && !url_key) {
        return null;
    }

    const postImgContent = loading ? (
        <HeroBlogPostShimmer isImgPlaceholder={true} />
    ) : (
        imgSrc && (
            <Link to={url} className={classes.images}>
                <div className={classes.imagesBlock}>
                    <Image alt={postThumbnailAlt} src={imgSrc} width="100%" height="auto" />
                </div>
            </Link>
        )
    );
    const formatDateContent = loading ? (
        <HeroBlogPostShimmer isDatePlaceholder={true} />
    ) : (
        <div className={classes.date}>{formatDate}</div>
    );
    const postTitle = loading ? (
        <HeroBlogPostShimmer isTitlePlaceholder={true} />
    ) : (
        <h1 className={classes.title}>
            <Link to={url} title={title}>
                {title}
            </Link>
        </h1>
    );
    const postTextContent = loading ? (
        <HeroBlogPostShimmer isTextPlaceholder={true} />
    ) : (
        <RichText classes={{ root: classes.content }} content={shortContent} />
    );
    const postTagContent =
        loading && tag_ids ? <HeroBlogPostShimmer isTagPlaceholder={true} /> : <PostTags tagIds={tag_ids} />;

    return (
        <div className={classes.heroPost}>
            {postImgContent}
            <div className={loading ? classes.heroPostContentLoading : classes.heroPostContent}>
                {formatDateContent}
                {postTitle}
                {postTextContent}
                {postTagContent}
            </div>
        </div>
    );
};

HeroBlogPost.propTypes = {
    id: number
};

export default HeroBlogPost;
