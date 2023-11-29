import classnames from 'classnames';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import classes from './addToCart.module.css';

const AddToCartButton = ({ item, isHovering = false }) => {
    const { formatMessage } = useIntl();

    const textStyle = isHovering ? { borderColor: 'rgb(2, 53, 39)' } : null;

    const buttonInStock = (
        <span
            aria-label={formatMessage({
                id: 'addToCartButton.addItemToCartAriaLabel',
                defaultMessage: 'Add to Bag'
            })}
            className={classnames(classes.root, classes.inStock, { [classes.inStockHover]: isHovering })}
            style={textStyle}
        >
            <FormattedMessage id="addToCartButton.addItemToCart" defaultMessage="ADD TO BAG" />
        </span>
    );

    const buttonOutOfStock = (
        <span
            aria-label={formatMessage({
                id: 'addToCartButton.itemOutOfStockAriaLabel',
                defaultMessage: 'Out of Stock'
            })}
            className={classnames(classes.root, classes.outOfStock)}
        >
            <FormattedMessage id="addToCartButton.itemOutOfStock" defaultMessage="OUT OF STOCK" />
        </span>
    );

    return item.stock_status === 'IN_STOCK' && item.max_qty >= 1 ? buttonInStock : buttonOutOfStock;
};

export default AddToCartButton;
