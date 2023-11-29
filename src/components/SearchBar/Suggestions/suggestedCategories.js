import { arrayOf, shape, string } from 'prop-types';
import React from 'react';

import classes from './suggestedCategories.module.css';
import SuggestedCategory from './suggestedCategory';

const SuggestedCategories = ({ categories }) => {
    const items = categories.map(({ label, value: categoryId, url }) => (
        <li key={categoryId}>
            <SuggestedCategory url={url} label={label} />
        </li>
    ));

    return <ul className={classes.root}>{items}</ul>;
};

export default SuggestedCategories;

SuggestedCategories.propTypes = {
    categories: arrayOf(
        shape({
            label: string.isRequired,
            value: string.isRequired,
            url: string.isRequired
        })
    ).isRequired
};
