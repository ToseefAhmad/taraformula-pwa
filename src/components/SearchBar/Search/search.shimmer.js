import PropTypes from 'prop-types';
import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './search.module.css';

const SearchShimmer = ({ offsetTop, searchRef }) => {
    return (
        <div className={classes.shimmer} style={{ top: offsetTop }} ref={searchRef}>
            <Shimmer width="100%" height="100%" />
        </div>
    );
};

export default SearchShimmer;

SearchShimmer.propTypes = {
    offsetTop: PropTypes.number,
    searchRef: PropTypes.any.isRequired
};
