import { bool, func, oneOfType, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import PriceSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary';
import ItemsReview from '@magento/venia-ui/lib/components/CheckoutPage/ItemsReview';

import defaultClasses from './orderSummary.module.css';

const OrderSummary = ({
    isUpdating,
    classes: propClasses,
    isCheckout,
    shouldRefetchPrices,
    setShouldRefetchPrices
}) => {
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <div className={classes.root}>
            <h4 className={classes.title}>
                <FormattedMessage id={'checkoutPage.shoppingBag'} defaultMessage={'Shopping Bag'} />
            </h4>

            <div className={classes.detailContainer}>
                <ItemsReview isCheckout={isCheckout} classes={{ itemsReviewContainer: classes.itemsReview }} />
                <PriceSummary
                    isUpdating={isUpdating}
                    shouldRefetchPrices={shouldRefetchPrices}
                    setShouldRefetchPrices={setShouldRefetchPrices}
                />
            </div>
        </div>
    );
};

OrderSummary.propTypes = {
    isUpdating: oneOfType([func, bool]),
    classes: string,
    isCheckout: bool,
    shouldRefetchPrices: bool,
    setShouldRefetchPrices: func
};

export default OrderSummary;
