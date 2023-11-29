import { bool, object, oneOf, shape, string } from 'prop-types';
import React from 'react';

import classes from '@app/components/Yotpo/yotpoItem.module.css';
import YotpoItemShimmer from '@app/components/Yotpo/yotpoItem.shimmer';
import Image from '@magento/venia-ui/lib/components/Image';

const IMAGE_WIDTH = 215;
const IMAGE_HEIGHT = 215;
const getParam = new Date().getTime();

/**
 * Renders a yotpo item.
 *
 * @param propClasses
 * @param item
 * @returns {JSX.Element}
 */
const YotpoItem = ({ item, itemClass, isProductPage, config }) => {
    if (!(item && Object.keys(item).length)) return <YotpoItemShimmer />;

    const title = item.post && `@${item.post.username}`;
    const cacheParam = `?p=${getParam}${item.image_id}`;
    const itemLink = config.instagramUrl;

    return (
        <>
            {item.low_resolution_image_url ? (
                <>
                    <div className={classes.imageContainer}>
                        <a href={itemLink} target="_blank" rel="noreferrer">
                            <Image
                                alt={title}
                                classes={{ root: classes[itemClass] }}
                                width={IMAGE_WIDTH}
                                height={IMAGE_HEIGHT}
                                resource={`https://${item.low_resolution_image_url}` + cacheParam}
                            />
                        </a>
                    </div>
                    {isProductPage && (
                        <a href={itemLink} target="_blank" rel="noreferrer" className={classes.link}>
                            {title}
                        </a>
                    )}
                </>
            ) : null}
        </>
    );
};

YotpoItem.propTypes = {
    item: shape({
        original_image_url: string,
        post: object,
        low_resolution: string,
        thumbnail: string,
        image_id: string
    }),
    itemClass: oneOf(['image', 'productImage', 'centeredImage']),
    isProductPage: bool,
    config: object
};

YotpoItem.defaultProps = {
    item: {},
    itemClass: 'image',
    isProductPage: false
};

export default YotpoItem;
