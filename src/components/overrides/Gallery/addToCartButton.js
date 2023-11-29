import { string, number, shape } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../Button';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './addToCartButton.module.css';
import { useAddToCartButton } from './useAddToCartButton';

const AddToCartButton = props => {
    const talonProps = useAddToCartButton({
        item: props.item
    });
    const { handleAddToCart, isDisabled, isInStock, isLoading } = talonProps;
    const { formatMessage } = useIntl();

    const classes = mergeClasses(defaultClasses, props.classes);

    const buttonText = isLoading ? (
        <FormattedMessage id="addToCartButton.addingItemToCart" defaultMessage="ADDING TO BAG" />
    ) : (
        <FormattedMessage id="addToCartButton.addItemToCart" defaultMessage="ADD TO BAG" />
    );

    const buttonInStock = (
        <Button
            aria-label={formatMessage({
                id: 'addToCartButton.addItemToCartAriaLabel',
                defaultMessage: 'Add to Bag'
            })}
            className={classes.root}
            disabled={isDisabled}
            onPress={handleAddToCart}
            priority="high"
            type="button"
        >
            <span className={classes.text}>{buttonText}</span>
        </Button>
    );

    const buttonOutOfStock = (
        <Button
            aria-label={formatMessage({
                id: 'addToCartButton.itemOutOfStockAriaLabel',
                defaultMessage: 'Out of Stock'
            })}
            className={classes.root}
            disabled={isDisabled}
            onPress={handleAddToCart}
            priority="high"
            type="button"
        >
            <span className={classes.text}>
                <FormattedMessage id="addToCartButton.itemOutOfStock" defaultMessage="OUT OF STOCK" />
            </span>
        </Button>
    );

    return isInStock ? buttonInStock : buttonOutOfStock;
};

export default AddToCartButton;

AddToCartButton.propTypes = {
    classes: shape({
        root: string,
        root_selected: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string
        }),
        stock_status: string.isRequired,
        type_id: string.isRequired,
        url_key: string.isRequired,
        url_suffix: string,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    value: number,
                    currency: string
                })
            })
        })
    })
};
