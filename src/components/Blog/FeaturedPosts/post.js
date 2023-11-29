import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';
import { getURL } from '@amasty/blog-pro/src/utils';
import { bool, string } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { useAmBlogProContext } from '@app/components/Blog/context';
import { getCorrectDateFormat } from '@app/components/Blog/time';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import Image from '@magento/venia-ui/lib/components/Image';

import classes from './featuredPosts.module.css';

const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 270;

const Post = ({
    url_key,
    post_thumbnail: postThumbnail,
    list_thumbnail: listThumbnail,
    post_thumbnail_alt: postThumbnailAlt,
    title,
    categories: category_ids,
    published_at,
    dragging
}) => {
    const { settings, getCategoriesByIds } = useAmBlogProContext();
    const categories = getCategoriesByIds(category_ids);
    const categoryName = categories.length > 0 ? categories[0].name : '';
    const categoryUrl = categories.length > 0 ? categories[0].url_key : '';

    const url = getURL(BLOG_URLS_BY_SECTION.POST, url_key);
    const imgSrc = listThumbnail || postThumbnail || transparentPlaceholder;
    const { post_image_width, post_image_height } = settings || {};
    const imgWidth = post_image_width || IMAGE_WIDTH;
    const imgHeight = post_image_height || IMAGE_HEIGHT;
    const date = getCorrectDateFormat(published_at);

    const dragHandler = e => {
        if (dragging) {
            e.preventDefault();
        }
    };

    const imgContainerStyle = {
        paddingTop: `${(imgHeight / imgWidth) * 100}%`
    };

    return (
        <div className={classes.post}>
            {categoryName && (
                <Link onClick={dragHandler} to={`/blog/category/${categoryUrl}`} title={categoryName}>
                    <div className={classes.category}>{categoryName}</div>
                </Link>
            )}
            {!categoryName && <div className={classes.categoryPlaceHolder} />}
            <Link onClick={dragHandler} to={url} className={classes.images} title={title} style={imgContainerStyle}>
                <Image
                    alt={postThumbnailAlt}
                    classes={{
                        image: classes.image,
                        root: classes.imageContainer
                    }}
                    src={`${imgSrc.replace(/^\//, '')}`}
                    width={imgWidth}
                    height={imgHeight}
                />
            </Link>
            <Link onClick={dragHandler} to={url} title={title}>
                <p className={classes.date}>{date}</p>
                <h2 className={classes.postTitle}>{title}</h2>
            </Link>
        </div>
    );
};

Post.propTypes = {
    url_key: string,
    post_thumbnail: string,
    list_thumbnail: string,
    post_thumbnail_alt: string,
    title: string,
    categories: string,
    published_at: string,
    dragging: bool
};

export default Post;
