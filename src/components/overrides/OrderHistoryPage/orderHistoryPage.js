import { bool, number } from 'prop-types';
import React, { useMemo, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import StripeContextProvider from '@app/talons/Stripe/stripeContextProvider';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useOrderHistoryPage } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderHistoryPage';
import { useToasts } from '@magento/peregrine/lib/Toasts';
import Button from '@magento/venia-ui/lib/components/Button';
import Link from '@magento/venia-ui/lib/components/Link';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './orderHistoryPage.module.css';
import OrderRow from './orderRow';

const OrderHistoryPage = ({ pageSizeProp, isOrderHistoryPage }) => {
    const { errorMessage, loadMoreOrders, isBackgroundLoading, isLoadingWithoutData, orders } = useOrderHistoryPage({
        pageSizeProp
    });

    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const history = useHistory();

    const PAGE_TITLE = formatMessage({
        id: 'orderHistoryPage.pageTitleText',
        defaultMessage: 'My Orders'
    });

    const orderLabels = (
        <div className={classes.orderDetailLabels}>
            <span className={classes.orderDetailLabel}>
                <FormattedMessage id={'orderHistoryPage.orderNumberText'} defaultMessage={'Order #'} />
            </span>
            <span className={classes.orderDetailLabel}>
                <FormattedMessage id={'orderHistoryPage.orderDateText'} defaultMessage={'Date'} />
            </span>
            <span className={classes.orderShipToLabel}>
                <FormattedMessage id={'orderHistoryPage.orderShipText'} defaultMessage={'Ship to'} />
            </span>
            <span className={classes.orderTotalLabel}>
                <FormattedMessage id={'orderHistoryPage.orderTotalText'} defaultMessage={'Total'} />
            </span>
            <span className={classes.orderDetailLabel}>
                <FormattedMessage id={'orderHistoryPage.orderStatusText'} defaultMessage={'Status'} />
            </span>
        </div>
    );

    const orderRows = orders.map(order => {
        return <OrderRow key={order.id} order={order} />;
    });

    const pageContents = useMemo(() => {
        if (isLoadingWithoutData || (isBackgroundLoading && !orders.length)) {
            return (
                <LoadingIndicator>
                    <FormattedMessage
                        id={'orderHistoryPage.orderLoadingText'}
                        defaultMessage={'Loading order history'}
                    />
                </LoadingIndicator>
            );
        } else if (!isBackgroundLoading && !orders.length) {
            return (
                <div className={classes.noOrders}>
                    <h4>
                        <FormattedMessage
                            id={'orderHistoryPage.emptyDataMessage'}
                            defaultMessage={'You currently have no orders.'}
                        />
                    </h4>
                    <div className={classes.noOrdersActions}>
                        <Button onClick={() => history.push('/hair-care')} priority="primary">
                            <FormattedMessage id={'orderHistoryPage.shopHair'} defaultMessage={'Shop Hair'} />
                        </Button>
                        <Button onClick={() => history.push('/skin-care')} priority="primary">
                            <FormattedMessage id={'orderHistoryPage.shopSkin'} defaultMessage={'Shop Skin'} />
                        </Button>
                    </div>
                </div>
            );
        } else if (orders.length) {
            return (
                <div className={classes.orderList}>
                    {orderLabels}
                    {orderRows}
                </div>
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isBackgroundLoading, isLoadingWithoutData, orderRows, orders.length]);

    const loadMoreButton = !isBackgroundLoading && loadMoreOrders && (
        <div className={classes.loadMoreButton}>
            <Button onClick={loadMoreOrders} priority="primary" fill="outline">
                <FormattedMessage id={'global.loadMore'} defaultMessage={'Load More'} />
            </Button>
        </div>
    );

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                message: errorMessage,
                dismissable: true,
                timeout: 10000
            });
        }
    }, [addToast, errorMessage]);

    const orderHistorySection = orders.length ? (
        <OrderHistoryContextProvider>
            <div className={classes.sectionRoot}>
                <div className={classes.heading}>
                    <h4 className={classes.title}>{PAGE_TITLE}</h4>
                    <Link className={classes.link} to={'/order-history'}>
                        <FormattedMessage id={'orderHistoryPage.sectionTitleText'} defaultMessage={'View All Orders'} />
                    </Link>
                </div>
                {pageContents}
            </div>
        </OrderHistoryContextProvider>
    ) : null;

    return isOrderHistoryPage ? (
        <OrderHistoryContextProvider>
            <StripeContextProvider>
                <AccountPageWrapper pageTitle={PAGE_TITLE} path={'/order-history'}>
                    <div className={classes.root}>
                        {pageContents}
                        {loadMoreButton}
                    </div>
                </AccountPageWrapper>
            </StripeContextProvider>
        </OrderHistoryContextProvider>
    ) : (
        orderHistorySection
    );
};

export default OrderHistoryPage;

OrderHistoryPage.propTypes = {
    pageSizeProp: number,
    isOrderHistoryPage: bool
};

OrderHistoryPage.defaultProps = {
    pageSizeProp: 12,
    isOrderHistoryPage: true
};
