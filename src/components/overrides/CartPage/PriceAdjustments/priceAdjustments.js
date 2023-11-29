import { objectOf, func, string } from 'prop-types';
import React, { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { Accordion, Section } from '@magento/venia-ui/lib/components/Accordion';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './priceAdjustments.module.css';

const CouponCode = React.lazy(() => import('./CouponCode'));

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

    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Accordion classes={{ root: classes.accordionRoot }} canOpenMultiple={true}>
                <Section
                    classes={{
                        contents_container: classes.sectionContentsContainer,
                        title: classes.sectionTitle,
                        title_wrapper: classes.sectionTitleWrapper,
                        title_container: classes.sectionTitleContainer,
                        subtitle: classes.sectionSubtitle,
                        icon: classes.sectionIcon
                    }}
                    id={'coupon_code'}
                    title={
                        <FormattedMessage
                            id={'priceAdjustments.gotAPromotionCode'}
                            defaultMessage={'Got a promotion code?'}
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id={'section.enterPromotionCode'}
                            defaultMessage={'Please enter your promotion code'}
                        />
                    }
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        <CouponCode setIsCartUpdating={setIsCartUpdating} />
                    </Suspense>
                </Section>
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;

PriceAdjustments.propTypes = {
    setIsCartUpdating: func,
    classes: objectOf(string)
};
