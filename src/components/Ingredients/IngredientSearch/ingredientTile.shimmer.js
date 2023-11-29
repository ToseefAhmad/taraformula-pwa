import React from 'react';

import classes from '@app/components/Ingredients/IngredientSearch/ingredientTile.module.css';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const IngredientTileShimmer = () => {
    return (
        <div className={classes.ingredientTile}>
            <div className={classes.ingredientImageWrapper}>
                <div className={classes.shimmerImage}>
                    <Shimmer height="100%" width="100%" style={{ marginBottom: '8px' }} />
                </div>
            </div>
            <div className={classes.ingredientSource}>
                <Shimmer width="100%" height="20px" style={{ marginBottom: '8px', marginTop: '15px' }} />
                <Shimmer width="100%" height="20px" />
            </div>
            <div className={classes.ingredientData}>
                <div className={classes.ingredientDataItem}>
                    <span className={classes.itemDescriptionMb}>
                        <Shimmer width="50%" height="20px" />
                    </span>
                    <Shimmer width="50%" height="20px" />
                </div>
                <div className={classes.ingredientDataItem}>
                    <span className={classes.itemDescriptionMb}>
                        <Shimmer width="50%" height="20px" />
                    </span>
                    <Shimmer width="50%" height="20px" />
                </div>
            </div>
            <div className={classes.productList}>
                <Shimmer width="100%" height="20px" />
                <Shimmer width="100%" height="20px" />
            </div>
        </div>
    );
};

export default IngredientTileShimmer;
