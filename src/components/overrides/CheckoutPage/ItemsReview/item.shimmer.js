import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './item.module.css';

const ItemShimmer = () => {
    return (
        <div className={classes.itemShimmerContainer}>
            <div className={classes.itemShimmer}>
                <Shimmer width="100%" height="100%" />
            </div>
            <div className={classes.itemShimmer}>
                <Shimmer width="100%" height="100%" />
            </div>
        </div>
    );
};

export default ItemShimmer;
