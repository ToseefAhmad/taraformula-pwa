import { shape, string } from 'prop-types';
import React from 'react';

import defaultClasses from '@app/pageBuilder/ContentTypes/BestsellerSlider/item.shimmer.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const ItemShimmer = ({ classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <div className={classes.productCategory}>
                <Shimmer width="100%" key="product-category" />
            </div>
            <div className={classes.imageContainer}>
                <Shimmer width="100%" height="100%" key="product-image" />
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

ItemShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default ItemShimmer;
