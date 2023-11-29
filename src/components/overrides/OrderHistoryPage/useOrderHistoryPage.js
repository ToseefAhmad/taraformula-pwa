import { useQuery } from '@apollo/client';
import { number } from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';

import { GET_CUSTOMER_ORDERS } from './orderHistoryPage.gql';

export const useOrderHistoryPage = ({ pageSizeProp }) => {
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const [pageSize, setPageSize] = useState(pageSizeProp);

    const { data: orderData, error: getOrderError, loading: orderLoading } = useQuery(GET_CUSTOMER_ORDERS, {
        fetchPolicy: 'network-only',
        variables: {
            pageSize
        }
    });

    const orders = orderData ? orderData.customer.orders.items : [];
    const isLoadingWithoutData = !orderData && orderLoading;
    const isBackgroundLoading = !!orderData && orderLoading;

    const derivedErrorMessage = useMemo(() => deriveErrorMessage([getOrderError]), [getOrderError]);

    const loadMoreOrders = useMemo(() => {
        if (orderData) {
            const { page_info } = orderData.customer.orders;
            const { current_page, total_pages } = page_info;

            if (current_page < total_pages) {
                return () => setPageSize(current => current + pageSizeProp);
            }
        }

        return null;
    }, [orderData, pageSizeProp]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    return {
        errorMessage: derivedErrorMessage,
        isBackgroundLoading,
        isLoadingWithoutData,
        loadMoreOrders,
        orders
    };
};

useOrderHistoryPage.propTypes = {
    pageSizeProp: number
};

useOrderHistoryPage.defaultProps = {
    pageSizeProp: 12
};
