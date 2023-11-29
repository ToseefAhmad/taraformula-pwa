import { shape, string } from 'prop-types';
import React from 'react';

import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './item.module.css';

const GalleryItemShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <div className={classes.images}>
                <Shimmer width="100%" key="product-image">
                    <Image
                        alt="Placeholder for gallery item image"
                        classes={{
                            image: classes.image,
                            root: classes.imageContainer
                        }}
                        src={transparentPlaceholder}
                    />
                </Shimmer>
            </div>
            <div className={classes.nameWrapper}>
                <Shimmer width="100%" key="product-name" />
            </div>
            <div className={classes.actionWrapper}>
                <div className={classes.price}>
                    <Shimmer width="30%" key="product-price" />
                </div>
                <div className={classes.actionsContainer}>
                    <Shimmer width="50%" key="add-to-cart" />
                </div>
            </div>
        </div>
    );
};

GalleryItemShimmer.propTypes = {
    classes: shape({
        root: string,
        images: string,
        image: string,
        imageContainer: string,
        nameWrapper: string,
        actionWrapper: string,
        price: string,
        actionsContainer: string
    })
};
export default GalleryItemShimmer;
