import { node, string } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const IngredientLink = ({ url, children }) => {
    return <Link to={'/ingredients/' + url}>{children}</Link>;
};

IngredientLink.propTypes = {
    url: string,
    children: node
};
export default IngredientLink;
