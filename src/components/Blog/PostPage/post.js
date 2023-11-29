import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';
import { getURL } from '@amasty/blog-pro/src/utils';
import { string } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { useAmBlogProContext } from '@app/components/Blog/context';
import { getCorrectDateFormat } from '@app/components/Blog/time';
import Image from '@magento/venia-ui/lib/components/Image';

import classes from './post.module.css';

const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 270;
const Post = ({
    url_key,
    post_thumbnail: postThumbnail,
    list_thumbnail: listThumbnail,
    post_thumbnail_alt: postThumbnailAlt,
    title,
    categories: category_ids,
    published_at
}) => {
    const { settings, getCategoriesByIds } = useAmBlogProContext();
    const categories = getCategoriesByIds(category_ids);
    const categoryName = categories.length > 0 ? categories[0].name : '';

    const url = getURL(BLOG_URLS_BY_SECTION.POST, url_key);
    const imgSrc = listThumbnail || postThumbnail;
    const { post_image_width, post_image_height } = settings || {};
    const imgWidth = post_image_width || IMAGE_WIDTH;
    const imgHeight = post_image_height || IMAGE_HEIGHT;
    const date = getCorrectDateFormat(published_at);

    const imgContainerStyle = {
        paddingTop: `${(imgHeight / imgWidth) * 100}%`
    };

    return (
        <div className={classes.post}>
            {categoryName && (
                <Link to={url} title={title}>
                    <div className={classes.category}>{categoryName}</div>
                </Link>
            )}
            {!categoryName && <div className={classes.categoryPlaceHolder} />}
            <Link to={url} className={classes.images} title={title} style={imgContainerStyle}>
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
            <Link to={url} title={title}>
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
    published_at: string
};

export default Post;
