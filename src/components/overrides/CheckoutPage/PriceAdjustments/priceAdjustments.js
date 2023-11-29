import { objectOf, func, string } from 'prop-types';
import React, { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './priceAdjustments.module.css';

const CouponCode = React.lazy(() => import('@app/components/overrides/CartPage/PriceAdjustments/CouponCode'));

/**
 * PriceAdjustments is a child component of the CartPage component.
 * It renders the price adjustments forms for applying gift cards, coupons, and the shipping method.
 * All of which can adjust the cart total.
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating A callback function for setting the updating state of the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [priceAdjustments.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/priceAdjustments.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import PriceAdjustments from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments'
 */
const PriceAdjustments = props => {
    const { setIsCartUpdating } = props;

    return (
        <div className={classes.root}>
            <h4 className={classes.title}>
                <FormattedMessage id={'priceAdjustments.gotAPromotionCode'} defaultMessage={'Got a promotion code?'} />
            </h4>
            <Suspense fallback={<LoadingIndicator />}>
                <CouponCode setIsCartUpdating={setIsCartUpdating} />
            </Suspense>
        </div>
    );
};

export default PriceAdjustments;

PriceAdjustments.propTypes = {
    setIsCartUpdating: func,
    classes: objectOf(string)
};
