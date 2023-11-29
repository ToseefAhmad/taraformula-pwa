import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';

import Shimmer from './Search/search.shimmer';

// We are lazy loading search bar, because user might never open it
const Search = React.lazy(() => import('./Search/search'));

const SearchBar = ({ offsetTop, isOpen, toggleSearch, searchRef }) => {
    return (
        isOpen && (
            <Suspense fallback={<Shimmer offsetTop={offsetTop} searchRef={searchRef} />}>
                <Route>
                    <Search searchRef={searchRef} offsetTop={offsetTop} isOpen={isOpen} toggleSearch={toggleSearch} />
                </Route>
            </Suspense>
        )
    );
};

export default SearchBar;

SearchBar.displayName = 'SearchBar';

SearchBar.propTypes = {
    searchRef: PropTypes.any,
    offsetTop: PropTypes.number,
    isOpen: PropTypes.bool,
    toggleSearch: PropTypes.func
};
