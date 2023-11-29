import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './list.module.css';

const ListShimmer = () => {
    // By default in grid list should be 8 posts
    const postLength = 8;
    const rows = [];
    for (let i = 0; i < postLength; i++) {
        rows.push(<Shimmer key={i} width={'100%'} height={'100%'} style={{ minHeight: '512px' }} />);
    }

    return (
        <div className={classes.root}>
            <div className={classes.gridRoot}>{rows}</div>
            <div className={classes.loadingGridPlaceholder} />
        </div>
    );
};

export default ListShimmer;
