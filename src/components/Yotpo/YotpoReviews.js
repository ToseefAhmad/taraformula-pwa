import React from 'react';

import { useWriteReview } from './useWriteReview';
import { useYotpoReviewsRefresh } from './useYotpoReviews';

/**
 * Adds a div to the DOM for Yotpo to embed reviews
 */
const YotpoReviews = ({ product = {} }) => {
    useYotpoReviewsRefresh();

    let productTag = product.yotpo_product_tag_label && product.yotpo_product_tag_label.toLowerCase();

    if (productTag && productTag === 'default') {
        productTag = '';
    }

    useWriteReview();

    return (
        <div
            id="yotpo-reviews"
            className="yotpo yotpo-main-widget"
            data-product-id={product.id}
            data-price={product.price.regularPrice.amount.value}
            data-currency={product.price.regularPrice.amount.currency}
            data-description={product.meta_description}
            data-name={product.name}
            data-url={window.location.href}
            data-product-tags={productTag}
            data-image-url={product.product_main_image}
        />
    );
};

export default YotpoReviews;
