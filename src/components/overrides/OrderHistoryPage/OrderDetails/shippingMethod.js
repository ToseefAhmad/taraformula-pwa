import { arrayOf, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import classes from './shippingMethod.module.css';

const ShippingMethod = ({ data: { shipments, shippingMethod } }) => {
    let trackingElement;
    if (shipments.length) {
        trackingElement = shipments.map(shipment => {
            const { tracking: trackingCollection } = shipment;
            if (trackingCollection.length) {
                return trackingCollection.map(tracking => {
                    const { number } = tracking;

                    return (
                        <span className={classes.trackingRow} key={number}>
                            <FormattedMessage id="orderDetails.tracking" defaultMessage={'Tracking'} />: {number}
                        </span>
                    );
                });
            }
        });
    }

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <FormattedMessage id="orderDetails.shippingMethodLabel" defaultMessage="Shipping Method" />
            </div>
            <div className={classes.method}>{shippingMethod}</div>
            <div className={classes.tracking}>{trackingElement}</div>
        </div>
    );
};

export default ShippingMethod;

ShippingMethod.propTypes = {
    data: shape({
        shippingMethod: string,
        shipments: arrayOf(
            shape({
                id: string,
                tracking: arrayOf(
                    shape({
                        number: string
                    })
                )
            })
        )
    })
};
