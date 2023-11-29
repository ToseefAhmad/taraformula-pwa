import { string, shape } from 'prop-types';
import React, { Fragment, useMemo } from 'react';

import stickyClasses from '@app/components/overrides/ProductFullDetail/blocks/productSticky.module.css';
import classes from '@app/components/overrides/ProductFullDetail/productFullDetail.module.css';
import CarouselShimmer from '@magento/venia-ui/lib/components/ProductImageCarousel/carousel.shimmer';
import { ProductOptionsShimmer } from '@magento/venia-ui/lib/components/ProductOptions';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const ProductShimmer = ({ productType }) => {
    const options = useMemo(() => productType.includes('Configurable') && <ProductOptionsShimmer />, [productType]);

    return (
        <Fragment>
            <div className={classes.root}>
                <section className={classes.wrapper}>
                    <section className={classes.imageCarousel}>
                        <CarouselShimmer />
                    </section>
                    <section className={classes.rightSide}>
                        <h2 className={classes.productType}>
                            <Shimmer width="20%" height={2} key="product-influence-type" />
                        </h2>
                        <div className={classes.productName}>
                            <Shimmer width="100%" height={2} key="product-name" />
                        </div>
                        <div className={classes.afterTitle}>
                            <Shimmer width="15%" height={1} key="product-size" />
                            <Shimmer width="85%" height={1} key="product-price" />
                        </div>
                        <Shimmer
                            classes={{ root: classes.shortDescription }}
                            width="100%"
                            height={3}
                            key="product-shortDescription"
                        />
                        <div className={classes.options}>{options}</div>
                        <div className={classes.actionContainer}>
                            <div className={classes.quantity}>
                                <Shimmer width={10} height={3} classes={{ root: classes.quantityRoot }} />
                            </div>
                            <div className={classes.actions}>
                                <Shimmer width="100%" height={3} key="add-to-cart" />
                            </div>
                        </div>
                        <Shimmer width="100%" height={8} key="product-accordion" />
                    </section>
                </section>
                <section className={classes.feelGoodIngredients}>
                    <Shimmer width="100%" height="300px" key="feel-good-ingredients" />
                </section>
                <section className={classes.productContainer}>
                    <Shimmer width="100%" height={30} key="product-faq" />
                </section>
                <div className={stickyClasses.stickyContent}>
                    <div className={stickyClasses.stickyContainer}>
                        <Shimmer width="100%" height={4} />
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

ProductShimmer.defaultProps = {
    classes: {}
};

ProductShimmer.propTypes = {
    productType: string.isRequired,
    classes: shape({
        root: string,
        wrapper: string,
        imageCarousel: string,
        rightSide: string,
        afterTitle: string,
        priceWrapper: string,
        price: string,
        shortDescription: string,
        options: string,
        actionContainer: string,
        quantity: string,
        quantityRoot: string,
        actions: string,
        productContainer: string
    })
};

export default ProductShimmer;
