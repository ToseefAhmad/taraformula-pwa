import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './topBlockShimmer.module.css';

const TopBlockShimmer = () => {
    return (
        <div className={classes.categoryTopBannerShimmer}>
            <div className={classes.shimmerLeftImage}>
                <Shimmer width="100%" height="100%" />
            </div>
            <div className={classes.shimmerRightImage}>
                <Shimmer width="100%" height="100%" />
            </div>
            <div className={classes.shimmerTextContent}>
                <div className={classes.shimmerTextWrapper}>
                    <Shimmer width="100%" height="60%" />
                    <Shimmer width="80%" height="40%" />
                </div>
            </div>
        </div>
    );
};

export default TopBlockShimmer;
