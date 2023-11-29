import { shape, string } from 'prop-types';
import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './filterSidebar.module.css';

const FilterSidebar = () => {
    const items = Array.from({ length: 3 }).fill(null);
    const filterDataShimmer = items.map((item, index) => (
        <div key={index} className={classes.fillerDataShimmer}>
            <Shimmer width="64px" height="23px" style={{ marginTop: 21, marginBottom: 17 }} />
            <Shimmer width="50%" height="19px" style={{ marginBottom: 18 }} />
            <Shimmer width="50%" height="19px" style={{ marginBottom: 18 }} />
            <Shimmer width="50%" height="19px" style={{ marginBottom: 18 }} />
            <Shimmer width="50%" height="19px" style={{ marginBottom: 18 }} />
        </div>
    ));

    return (
        <aside className={classes.root} aria-live="polite" aria-busy="true">
            <Shimmer width="105px" height="59px" style={{ marginBottom: 25 }} />
            {filterDataShimmer}
        </aside>
    );
};

FilterSidebar.propTypes = {
    classes: shape({
        root: string
    })
};

export default FilterSidebar;
