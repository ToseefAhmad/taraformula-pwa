import { shape, arrayOf, string, number } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Item from './item';
import classes from './items.module.css';
import OrderTotal from './orderTotal';

const Items = ({ data: { items, total } }) => {
    const itemsComponent = items.map(item => <Item key={item.id} {...item} />);

    return (
        <table className={classes.root}>
            <thead>
                <tr>
                    <th className={classes.items}>
                        <FormattedMessage id="global.items" defaultMessage="Items" />
                    </th>
                    <th className={classes.qty}>
                        <FormattedMessage id="global.qty" defaultMessage="QTY" />
                    </th>
                    <th className={classes.price}>
                        <FormattedMessage id="global.price" defaultMessage="Price" />
                    </th>
                </tr>
            </thead>
            <tbody>{itemsComponent}</tbody>
            <OrderTotal data={total} />
        </table>
    );
};

export default Items;

Items.propTypes = {
    data: shape({
        items: arrayOf(
            shape({
                id: string,
                product_name: string,
                product_sale_price: shape({
                    currency: string,
                    value: number
                }),
                product_sku: string,
                product_url_key: string,
                selected_options: arrayOf(
                    shape({
                        label: string,
                        value: string
                    })
                ),
                quantity_ordered: number
            })
        ),
        total: shape({
            discounts: arrayOf(
                shape({
                    amount: shape({
                        currency: string,
                        value: number
                    })
                })
            ),
            grand_total: shape({
                currency: string,
                value: number
            }),
            subtotal: shape({
                currency: string,
                value: number
            }),
            total_tax: shape({
                currency: string,
                value: number
            }),
            total_shipping: shape({
                currency: string,
                value: number
            })
        })
    })
};
