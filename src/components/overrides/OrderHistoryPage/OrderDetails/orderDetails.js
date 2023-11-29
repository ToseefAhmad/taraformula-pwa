import { arrayOf, func, number, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import LinkButton from '@app/components/overrides/LinkButton';

import Items from './items';
import classes from './orderDetails.module.css';
import OrderStatus from './orderStatus';
import PaymentMethod from './paymentMethod';
import ShippingInformation from './shippingInformation';
import ShippingMethod from './shippingMethod';

const ConditionalWrapper = props => (props.condition ? props.children : null);

const OrderDetails = ({ orderData, handleReorderItems }) => {
    const { items, payment_methods, shipping_address, shipping_method, shipments, total } = orderData;
    const shippingMethodData = {
        shippingMethod: shipping_method,
        shipments
    };

    return (
        <div className={classes.root}>
            <LinkButton className={classes.reorderButton} onClick={handleReorderItems}>
                <FormattedMessage id="orderRow.reorder" defaultMessage="Reorder" />
            </LinkButton>
            <div className={classes.gridRowContainer}>
                <ConditionalWrapper condition={payment_methods}>
                    <div className={classes.paymentMethodContainer}>
                        <PaymentMethod data={payment_methods} />
                    </div>
                </ConditionalWrapper>
                <ConditionalWrapper condition={shipping_method}>
                    <div className={classes.shippingMethodContainer}>
                        <ShippingMethod data={shippingMethodData} />
                    </div>
                </ConditionalWrapper>
            </div>
            <div className={classes.gridRowContainer}>
                <ConditionalWrapper condition={shipping_address}>
                    <div className={classes.shippingInformationContainer}>
                        <ShippingInformation data={shipping_address} />
                    </div>
                </ConditionalWrapper>
            </div>
            <OrderStatus order={orderData} />
            <ConditionalWrapper condition={items && items.length}>
                <div className={classes.itemsContainer}>
                    <Items data={{ items, total }} />
                </div>
            </ConditionalWrapper>
        </div>
    );
};

export default OrderDetails;

OrderDetails.propTypes = {
    handleReorderItems: func,
    orderData: shape({
        billing_address: shape({
            city: string,
            country_code: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            street: arrayOf(string)
        }),
        items: arrayOf(
            shape({
                id: string,
                product_name: string,
                product_sale_price: shape({
                    currency: string,
                    value: number
                }),
                product_sku: string,
                selected_options: arrayOf(
                    shape({
                        label: string,
                        value: string
                    })
                ),
                quantity_ordered: number
            })
        ),
        payment_methods: arrayOf(
            shape({
                type: string,
                additional_data: arrayOf(
                    shape({
                        name: string,
                        value: string
                    })
                )
            })
        ),
        shipping_address: shape({
            city: string,
            country_code: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            street: arrayOf(string),
            telephone: string
        }),
        shipping_method: string,
        shipments: arrayOf(
            shape({
                id: string,
                tracking: arrayOf(
                    shape({
                        carrier: string,
                        number: string
                    })
                )
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
