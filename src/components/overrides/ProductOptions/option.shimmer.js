import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './option.module.css';

const OptionShimmer = () => {
    return (
        <div className={classes.root}>
            <Shimmer width="100%" height={4} />
        </div>
    );
};

export default OptionShimmer;
