import { shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './productSort.shimmer.module.css';

const ProductSortShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <div className={classes.sortButtonShimmerWrapper}>
                <Shimmer width="100%" />
            </div>
        </div>
    );
};

ProductSortShimmer.propTypes = {
    classes: shape({
        root: string,
        sortButtonShimmerWrapper: string
    })
};

export default ProductSortShimmer;
