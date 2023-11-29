import { shape, string, number, arrayOf } from 'prop-types';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { getDirection } from '@app/hooks/useDirection';
import { useOrderHistoryContext } from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Price from '@magento/venia-ui/lib/components/Price';

import classes from './item.module.css';

const Item = ({
    product_name,
    product_sale_price,
    product_url_key,
    quantity_ordered,
    selected_options,
    influence_type_label
}) => {
    const { currency, value: unitPrice } = product_sale_price;
    const orderHistoryState = useOrderHistoryContext();
    const { productURLSuffix } = orderHistoryState;
    const itemLink = `${product_url_key}${productURLSuffix}`;

    const mappedOptions = useMemo(
        () =>
            selected_options.map(option => ({
                option_label: option.label,
                value_label: option.value
            })),
        [selected_options]
    );

    return (
        <tr className={classes.root}>
            <td className={classes.cell}>
                <Link className={classes.title} to={itemLink}>
                    {influence_type_label && (
                        <span dir={getDirection()} className={classes.influenceType}>
                            {influence_type_label}
                        </span>
                    )}
                    <span>{product_name}</span>
                </Link>
                <ProductOptions
                    options={mappedOptions}
                    classes={{
                        options: classes.options
                    }}
                />
            </td>
            <td className={classes.qty}>{quantity_ordered}</td>
            <td className={classes.price}>
                <Price currencyCode={currency} value={unitPrice} />
            </td>
        </tr>
    );
};

export default Item;

Item.propTypes = {
    product_sku: string.isRequired,
    product_name: string.isRequired,
    product_sale_price: shape({
        currency: string,
        value: number
    }).isRequired,
    product_url_key: string.isRequired,
    quantity_ordered: number.isRequired,
    selected_options: arrayOf(
        shape({
            label: string,
            value: string
        })
    ).isRequired,
    influence_type_label: string
};
