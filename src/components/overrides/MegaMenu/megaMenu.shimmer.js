/* eslint-disable react/display-name */
import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './megaMenu.module.css';

const MegaMenuShimmer = () => {
    return (
        <div className={classes.shimmerWrapper}>
            <Shimmer width={4} height={1} />
        </div>
    );
};

export default MegaMenuShimmer;
