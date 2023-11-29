import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './ingredientDetailPage.module.css';

const CmsBlockShimmer = () => {
    return (
        <div className={classes.blockShimmer}>
            <div className={classes.imageContainerShimmer}>
                <div className={classes.shimmerImageBig}>
                    <Shimmer height="100%" width="100%" />
                </div>
                <div className={classes.smallImageContainerShimmer}>
                    <div className={classes.shimmerImageSmall}>
                        <Shimmer height="100%" width="100%" />
                    </div>
                </div>
            </div>

            <div className={classes.shimmerContainer}>
                <div className={classes.shimmerText}>
                    <Shimmer height="100%" width="100%" />
                </div>
                <div className={classes.shimmerText}>
                    <Shimmer height="100%" width="100%" />
                </div>
                <div className={classes.shimmerText}>
                    <Shimmer height="100%" width="60%" />
                </div>
                <div className={classes.shimmerButton}>
                    <Shimmer height="100%" width="100%" />
                </div>
            </div>
        </div>
    );
};

export default CmsBlockShimmer;
