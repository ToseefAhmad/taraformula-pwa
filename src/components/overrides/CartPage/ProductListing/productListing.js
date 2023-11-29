import PropTypes, { objectOf, string, func } from 'prop-types';
import React, { Fragment } from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import ErrorMessage from './errorMessage';
import Product from './product';
import classes from './productListing.module.css';
import { useProductListing } from './useProductListing';

/**
 * A child component of the CartPage component.
 * This component renders the product listing on the cart page.
 *
 * See [productListing.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/ProductListing/productListing.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import ProductListing from "@magento/venia-ui/lib/components/CartPage/ProductListing";
 */
const ProductListing = ({ onAddToWishlistSuccess, setIsCartUpdating, fetchCartDetails }) => {
    const { isLoading, error, items, setActiveEditItem, wishlistConfig } = useProductListing();

    if (isLoading) {
        return (
            <div>
                <Shimmer classes={{ root_rectangle: classes.shimmerRoot }} width="100%" />
                <Shimmer classes={{ root_rectangle: classes.shimmerRoot }} width="100%" />
                <Shimmer classes={{ root_rectangle: classes.shimmerRoot }} width="100%" />
            </div>
        );
    }

    if (items.length) {
        const productComponents = items.map(product => (
            <Product
                item={product}
                key={product.id}
                setActiveEditItem={setActiveEditItem}
                setIsCartUpdating={setIsCartUpdating}
                onAddToWishlistSuccess={onAddToWishlistSuccess}
                fetchCartDetails={fetchCartDetails}
                wishlistConfig={wishlistConfig}
            />
        ));

        return (
            <Fragment>
                <ErrorMessage error={error} />
                <ul className={classes.root}>{productComponents}</ul>
            </Fragment>
        );
    }

    return null;
};

ProductListing.propTypes = {
    classes: objectOf(string),
    fetchCartDetails: func,
    setIsCartUpdating: func,
    onAddToWishlistSuccess: func,
    freeItemIds: PropTypes.array
};

export default ProductListing;
