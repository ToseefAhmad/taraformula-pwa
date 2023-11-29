import ProgressBar from '@ramonak/react-progress-bar';
import classnames from 'classnames';
import { any } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { getDirection } from '@app/hooks/useDirection';
import { useScreenSize } from '@app/hooks/useScreenSize';

import classes from './orderStatus.module.css';

const OrderStatus = orderDetails => {
    const { isMobileScreen } = useScreenSize();

    if (!orderDetails.order) {
        return null;
    }

    const order = orderDetails.order;

    if (!order.readable_status) {
        return null;
    }

    const status = order.readable_status;
    const trackingUrl = order.tracking_url;
    const trackingNumber = order.tracking_number;

    let progress = 0;
    if (status === 'order_placed') {
        progress = isMobileScreen ? 10 : 5;
    } else if (status === 'order_confirmed' || status === 'order_canceled') {
        progress = isMobileScreen ? 38 : 33;
    } else if (status === 'order_shipped') {
        progress = isMobileScreen ? 66 : 62;
    } else if (status === 'order_delivered') {
        progress = 100;
    }

    const height = isMobileScreen ? progress + '%' : '2px';
    const width = isMobileScreen ? '2px' : '100%';
    const progressBarDirection = isMobileScreen ? 'ltr' : getDirection();

    const progressBar = (
        <ProgressBar
            completed={progress}
            isLabelVisible={false}
            borderRadius={'0'}
            height={height}
            width={width}
            bgColor={'#0C3527'}
            baseBgColor={'#E6EAE8'}
            dir={progressBarDirection}
            className={classes.progressBar}
        />
    );

    return (
        <div className={classes.orderStatusContainer}>
            <div className={classes.heading}>
                <FormattedMessage id="orderDetails.orderStatusLabel" defaultMessage="Order Status" />
            </div>
            <div>
                {progressBar}
                <div className={classes.root}>
                    <div className={classnames(status === 'order_placed' ? classes.bold : null, classes.status)}>
                        <FormattedMessage id="orderDetails.orderStatusPlaced" defaultMessage="Order Placed" />
                    </div>
                    {status === 'order_canceled' ? (
                        <div className={classnames(status === 'order_canceled' ? classes.bold : null, classes.status)}>
                            <FormattedMessage id="orderDetails.orderStatusCanceled" defaultMessage="Order Canceled" />
                        </div>
                    ) : (
                        <div className={classnames(status === 'order_confirmed' ? classes.bold : null, classes.status)}>
                            <FormattedMessage id="orderDetails.orderStatusConfirmed" defaultMessage="Order Confirmed" />
                        </div>
                    )}
                    <div className={classnames(classes.middleColumns, classes.status)}>
                        <div className={classnames(status === 'order_shipped' ? classes.bold : null)}>
                            <FormattedMessage id="orderDetails.orderStatusShipped" defaultMessage="Order Shipped" />
                        </div>
                        {trackingUrl && (
                            <div className={classes.trackingLink}>
                                <a href={trackingUrl} target={'_blank'} rel={'noreferrer'}>
                                    {trackingNumber}
                                </a>
                            </div>
                        )}
                    </div>
                    <div
                        className={classnames(
                            status === 'order_delivered' ? classes.bold : null,
                            classes.lastColumn,
                            classes.status
                        )}
                    >
                        <FormattedMessage id="orderDetails.orderStatusDelivered" defaultMessage="Order Delivered" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderStatus;

OrderStatus.propTypes = {
    orderDetails: any
};
