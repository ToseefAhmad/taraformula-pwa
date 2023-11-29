import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './ingredientDetailPageShimmer.module.css';

const IngredientDetailPageShimmer = () => {
    const productTile = (
        <div className={classes.relatedProductsShimmerContainer}>
            <div className={classes.relatedProductsShimmerImage}>
                <Shimmer width="100%" height="100%" />
            </div>
            <div className={classes.relatedProductsShimmerProductTitle}>
                <Shimmer width="100%" height="100%" />
            </div>
        </div>
    );

    const textShimmer = (
        <>
            <div className={classes.ingredientDetailsShimmerPTitle}>
                <Shimmer width="100%" height="100%" />
            </div>
            <div className={classes.ingredientDetailsShimmerText}>
                <Shimmer width="100%" height="100%" />
            </div>
            <div className={classes.ingredientDetailsShimmerText}>
                <Shimmer width="100%" height="100%" />
            </div>
            <div className={classes.ingredientDetailsShimmerText}>
                <Shimmer width="100%" height="100%" />
            </div>
            <div className={classes.ingredientDetailsShimmerText}>
                <Shimmer width="100%" height="100%" />
            </div>
            <div className={classes.ingredientDetailsShimmerText}>
                <Shimmer width="100%" height="100%" />
            </div>
        </>
    );

    const detailShimmer = (
        <div className={classes.ingredientDetailsShimmer}>
            <div className={classes.ingredientDetailsShimmerTop}>
                <div className={classes.ingredientDetailsShimmerLeft}>
                    <div className={classes.ingredientDetailsShimmerTitle}>
                        <Shimmer width="100%" height="100%" />
                    </div>
                    <div className={classes.ingredientDetailsShimmerFlexItem}>
                        <div className={classes.ingredientDetailsShimmerKnown}>
                            <Shimmer width="100%" height="100%" />
                        </div>
                        <div className={classes.ingredientDetailsShimmerValue}>
                            <Shimmer width="100%" height="100%" />
                        </div>
                    </div>
                    <div className={classes.ingredientDetailsShimmerSmallImage}>
                        <Shimmer width="100%" height="100%" />
                    </div>
                    {textShimmer}
                </div>
                <div className={classes.ingredientDetailsShimmerRight}>
                    <div className={classes.ingredientDetailsShimmerBigImage}>
                        <Shimmer width="100%" height="100%" />
                    </div>
                </div>
            </div>
            <div>
                <div className={classes.bottomBlockText}>{textShimmer}</div>
                <div className={classes.referenceBlock}>
                    <div className={classes.ingredientDetailsShimmerPTitle}>
                        <Shimmer width="100%" height="100%" />
                    </div>
                    <div className={classes.ingredientDetailsShimmerText}>
                        <Shimmer width="100%" height="100%" />
                    </div>
                    <div className={classes.ingredientDetailsShimmerText}>
                        <Shimmer width="100%" height="100%" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {detailShimmer}
            <div className={classes.suggestionBlocks}>
                <div className={classes.relatedProductsShimmer}>
                    <div className={classes.relatedProductsShimmerTitle}>
                        <Shimmer width="100%" height="100%" />
                    </div>
                    <div className={classes.relatedProductsShimmerSlider}>
                        {productTile}
                        {productTile}
                    </div>
                </div>
                <div className={classes.discoverProductsShimmer}>
                    <div className={classes.relatedProductsShimmerTitle}>
                        <Shimmer width="100%" height="100%" />
                    </div>
                    <div className={classes.relatedProductsShimmerSlider}>
                        {productTile}
                        {productTile}
                    </div>
                    <div className={classes.relatedProductsShimmerButton}>
                        <Shimmer width="100%" height="100%" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IngredientDetailPageShimmer;
