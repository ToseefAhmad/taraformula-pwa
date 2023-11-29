import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './topBlock.shimmer.module.css';

const TopBlocksShimmer = () => {
    return (
        <div className={classes.blockShimmer}>
            <div className={classes.firstContainer}>
                <div className={classes.shimmerImageBig}>
                    <Shimmer height="100%" width="100%" />
                </div>
                <div className={classes.firstContainerTextContainer}>
                    <div className={classes.firstContainerTextHeading}>
                        <Shimmer height="100%" width="100%" />
                    </div>
                    <div className={classes.firstContainerTextHeading}>
                        <Shimmer height="100%" width="100%" />
                    </div>
                    <div className={classes.firstContainerText}>
                        <Shimmer height="100%" width="100%" />
                    </div>
                    <div className={classes.firstContainerText}>
                        <Shimmer height="100%" width="100%" />
                    </div>
                    <div className={classes.firstContainerText}>
                        <Shimmer height="100%" width="100%" />
                    </div>
                    <div className={classes.firstContainerText}>
                        <Shimmer height="100%" width="100%" />
                    </div>
                    <div className={classes.firstContainerButton}>
                        <Shimmer height="100%" width="100%" />
                    </div>
                </div>
            </div>

            <div className={classes.additionalContainers}>
                <div className={classes.secondContainer}>
                    <div className={classes.shimmerImage}>
                        <Shimmer height="100%" width="100%" />
                    </div>
                </div>
                <div className={classes.thirdContainer}>
                    <div className={classes.shimmerImage}>
                        <Shimmer height="100%" width="100%" />
                    </div>
                </div>
                <div className={classes.fourthContainer}>
                    <div className={classes.shimmerImage}>
                        <Shimmer height="100%" width="100%" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBlocksShimmer;
