import { any, object, string, array, number } from 'prop-types';
import React, { Fragment } from 'react';

import { MinusFull, ThinPlus } from '@app/components/Icons';
import { QuantityFields } from '@app/components/overrides/CartPage/ProductListing/quantity';
import Price from '@app/components/overrides/Price';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

import classes from './productSticky.module.css';

const StickyBlock = ({
    product,
    influenceType,
    sizeAttribute,
    errors,
    cartActionContent,
    currencyCode,
    selectedOptionLabels,
    max
}) => {
    const selectedOption =
        isProductConfigurable(product) &&
        selectedOptionLabels &&
        selectedOptionLabels.map((item, index) => (
            <div key={index} className={classes.productOption}>
                {item.option}: {item.attributeValue}
            </div>
        ));

    return (
        <Fragment>
            <div className={classes.stickyContent}>
                <div className={classes.stickyContainer}>
                    <div className={classes.stickyWrapper}>
                        <div className={classes.stickyRight}>
                            <div className={classes.influence}>{influenceType}</div>
                            <div className={classes.stickyName}>{product.name}</div>
                            <div className={classes.sizeAttribute}>{sizeAttribute}</div>

                            <div className={classes.stickyPrice}>
                                <Price
                                    currencyCode={currencyCode}
                                    oldValue={product.price_range.maximum_price.regular_price.value}
                                    value={product.price_range.maximum_price.final_price.value}
                                />
                            </div>
                            {selectedOption}
                        </div>
                        <div className={classes.stickyLeft}>
                            <div className={classes.stickyQuantity}>
                                <QuantityFields
                                    min={1}
                                    max={max}
                                    message={errors.get('quantity')}
                                    classes={{
                                        root: classes.quantityRoot
                                    }}
                                    sticky={true}
                                    field="sticky-quantity"
                                    decreaseIcon={MinusFull}
                                    increaseIcon={ThinPlus}
                                    decreaseIconSize={15}
                                    increaseIconSize={15}
                                />
                            </div>
                            <div className={classes.stickyActions}>{cartActionContent}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

StickyBlock.propTypes = {
    product: object,
    influenceType: any,
    sizeAttribute: any,
    errors: any,
    currencyCode: string,
    cartActionContent: any,
    optionSelections: object,
    selectedOptionLabels: array,
    max: number
};

export default StickyBlock;
