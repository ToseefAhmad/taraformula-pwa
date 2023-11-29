import { shape, string } from 'prop-types';
import React, { Fragment } from 'react';

import { GalleryShimmer } from '@app/components/overrides/Gallery';
import defaultClasses from '@app/RootComponents/Category/category.module.css';
import TopBlockShimmer from '@app/RootComponents/Category/Shimmers/topBlockShimmer';
import { useStyle } from '@magento/venia-ui/lib/classify';

const CategoryContentShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const placeholderItems = Array.from({ length: 6 }).fill(null);

    return (
        <Fragment>
            <article className={classes.root}>
                <div className={classes.banner}>
                    <TopBlockShimmer />
                </div>
                <div className={classes.contentWrapper}>
                    <div className={classes.categoryContent}>
                        <GalleryShimmer items={placeholderItems} />
                    </div>
                </div>
            </article>
        </Fragment>
    );
};

CategoryContentShimmer.defaultProps = {
    classes: {}
};

CategoryContentShimmer.propTypes = {
    classes: shape({
        root: string,
        banner: string,
        contentWrapper: string,
        categoryContent: string
    })
};

export default CategoryContentShimmer;
