import { array, arrayOf, bool, func, shape } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import SuggestedCategories from './suggestedCategories';
import SuggestedProducts from './suggestedProducts';
import classes from './suggestions.module.css';
import { useSuggestions } from './useSuggestions';

const Suggestions = ({ showSuggestions, filters, products: { items }, toggleSearch }) => {
    const { categories } = useSuggestions({
        showSuggestions,
        filters,
        toggleSearch
    });

    // Render null without data
    if (!showSuggestions) {
        return null;
    }

    return (
        <Fragment>
            <h2 className={classes.heading}>
                <span>
                    <FormattedMessage id={'searchBar.products_heading'} defaultMessage={'Products'} />
                </span>
            </h2>
            <SuggestedProducts products={items} />
            <h2 className={classes.heading}>
                <span>
                    <FormattedMessage id={'searchBar.categories_heading'} defaultMessage={'Pages'} />
                </span>
            </h2>
            <SuggestedCategories categories={categories} />
        </Fragment>
    );
};

export default Suggestions;

Suggestions.propTypes = {
    showSuggestions: bool,
    filters: array,
    products: shape({
        items: arrayOf(shape({}))
    }),
    toggleSearch: func.isRequired
};
