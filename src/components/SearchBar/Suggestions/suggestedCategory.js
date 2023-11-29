import { string } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import classes from './suggestedCategory.module.css';

const SuggestedCategory = ({ url, label }) => {
    return (
        <Link className={classes.root} to={url}>
            <span>{label}</span>
        </Link>
    );
};

export default SuggestedCategory;

SuggestedCategory.propTypes = {
    url: string.isRequired,
    label: string.isRequired
};
