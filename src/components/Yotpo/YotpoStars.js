import React from 'react';

import { useYotpoReviewsRefresh } from './useYotpoReviews';

/**
 * Adds a div to the dom for Yotpo to embed product ratings.
 */
const YotpoReviews = ({ product = {} }) => {
    useYotpoReviewsRefresh();

    return <div className="yotpo bottomLine" data-yotpo-product-id={product.id} />;
};

export default YotpoReviews;
