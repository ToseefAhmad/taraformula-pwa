import { object, shape, string, bool } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Item from '@app/components/overrides/CheckoutPage/ItemsReview/item';
import defaultClasses from '@app/components/overrides/CheckoutPage/ItemsReview/itemsReview.module.css';
import { useItemsReview } from '@magento/peregrine/lib/talons/CheckoutPage/ItemsReview/useItemsReview';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import ItemShimmer from './item.shimmer';

/**
 * Renders a list of items in an order.
 *
 * @param propClasses
 * @param data
 * @param isCheckout
 * @returns {JSX.Element}
 */
const ItemsReview = ({ classes: propClasses, data, isCheckout }) => {
    const classes = useStyle(defaultClasses, propClasses);
    const { items, isLoading, configurableThumbnailSource } = useItemsReview({ data });

    const loader = isCheckout ? (
        <ItemShimmer />
    ) : (
        <LoadingIndicator>
            <FormattedMessage
                id={'checkoutPage.fetchingItemsInYourOrder'}
                defaultMessage={'Fetching Items in your Order'}
            />
        </LoadingIndicator>
    );

    return (
        <>
            {isLoading ? (
                loader
            ) : (
                <div className={classes.itemsReviewContainer}>
                    <div className={classes.itemsContainer}>
                        {items.map(item => (
                            <Item key={item.id} {...item} configurableThumbnailSource={configurableThumbnailSource} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

ItemsReview.propTypes = {
    classes: shape({
        itemsReviewContainer: string,
        itemsContainer: string,
        showAllButton: string
    }),
    data: object,
    isCheckout: bool
};

ItemsReview.defaultProps = {
    classes: {},
    data: undefined
};

export default ItemsReview;
