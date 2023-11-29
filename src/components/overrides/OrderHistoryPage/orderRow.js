import { arrayOf, number, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import LinkButton from '@app/components/overrides/LinkButton';
import OrderDetails from '@app/components/overrides/OrderHistoryPage/OrderDetails';
import Price from '@magento/venia-ui/lib/components/Price';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './orderRow.module.css';
import { useOrderRow } from './useOrderRow';

const OrderRow = ({ order }) => {
    const { items, number: orderNumber, order_date: orderDate, shipments, status, total } = order;
    const { grand_total: grandTotal } = total;
    const { currency, value: orderTotal } = grandTotal;

    const { loading, isOpen, handleContentToggle, imagesData, handleReorderItems } = useOrderRow({
        items,
        orderNumber
    });
    const { formatMessage } = useIntl();

    // Convert date to ISO-8601 format so Safari can also parse it
    const isoFormattedDate = orderDate.replace(' ', 'T');
    let formattedDate = new Date(isoFormattedDate).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    formattedDate = formattedDate.replace(/-/g, '.');

    const hasShipment = !!shipments.length;
    const statusLowerCase = status.replaceAll(' ', '').toLowerCase();
    let derivedStatus;

    if (status === 'Complete') {
        derivedStatus = formatMessage({
            id: 'orderRow.completeText',
            defaultMessage: 'Complete'
        });
    } else if (hasShipment) {
        derivedStatus = formatMessage({
            id: 'orderRow.shippedText',
            defaultMessage: 'Shipped'
        });
    } else {
        derivedStatus = formatMessage({
            id: 'orderRow.' + statusLowerCase + 'Text',
            defaultMessage: status
        });
    }

    const contentClass = isOpen ? classes.content : classes.contentCollapsed;

    const viewHideOrderText = !isOpen ? (
        <span>
            <FormattedMessage id="orderRow.viewOrderText" defaultMessage="View order" />
        </span>
    ) : (
        <span className={classes.openedOrderText}>
            <FormattedMessage id="orderRow.hideOrderText" defaultMessage="Hide order" />
        </span>
    );

    const orderDetails = !loading && (
        <OrderDetails
            handleReorderItems={handleReorderItems}
            orderData={order}
            imagesData={imagesData}
            isOpen={isOpen}
        />
    );

    const orderTotalPrice =
        currency && orderTotal !== null ? <Price currencyCode={currency} value={orderTotal} /> : '-';

    const orderShipTo = `${order.shipping_address.firstname} ${order.shipping_address.lastname}`;

    return loading ? (
        <Shimmer width="100%" height="47px" classes={{ root_rectangle: classes.shimmer }} />
    ) : (
        <div className={classes.root}>
            <div className={classes.orderNumber}>
                <span className={classes.value}>{orderNumber}</span>
            </div>
            <div className={classes.orderDate}>
                <span className={classes.value}>{formattedDate}</span>
            </div>
            <div className={classes.orderShipTo}>
                <div className={classes.value}>{orderShipTo}</div>
            </div>
            <div className={classes.orderTotal}>
                <div className={classes.value}>{orderTotalPrice}</div>
            </div>
            <div className={classes.orderStatus}>
                <div className={classes.value}>{derivedStatus}</div>
            </div>
            <div className={classes.reOrder}>
                <LinkButton className={classes.reorderButton} onClick={handleReorderItems}>
                    <FormattedMessage id="orderRow.reorder" defaultMessage="Reorder" />
                </LinkButton>
            </div>
            <div className={classes.viewOrder}>
                <LinkButton className={classes.viewOrderButton} onClick={handleContentToggle} type="button">
                    {viewHideOrderText}
                </LinkButton>
            </div>
            <div className={contentClass}>{orderDetails}</div>
        </div>
    );
};

export default OrderRow;

OrderRow.propTypes = {
    order: shape({
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
        invoices: arrayOf(
            shape({
                id: string
            })
        ),
        number: string,
        order_date: string,
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
                        number: string
                    })
                )
            })
        ),
        status: string,
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
