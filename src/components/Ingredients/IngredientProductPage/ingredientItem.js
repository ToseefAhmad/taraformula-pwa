import { object, bool, func } from 'prop-types';
import React from 'react';

import IngredientLink from '@app/components/Ingredients/IngredientLink';
import classes from '@app/components/Ingredients/IngredientProductPage/ingredientProductPage.module.css';
import Image from '@magento/venia-ui/lib/components/Image';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

// Images appropriately.
const IMAGE_WIDTH = 326;
const IMAGE_HEIGHT = 413;

const IngredientItem = ({ item, isLoading, onClickCapture }) => {
    if (isLoading)
        return (
            <div className={classes.item}>
                <Shimmer width="100%" height="413px" />
                <div className={classes.name}>
                    <Shimmer width="100%" height={1} />
                </div>
                <div className={classes.description}>
                    <Shimmer width="100%" height={4} />
                </div>
            </div>
        );

    return (
        item &&
        item.entity_id && (
            <div className={classes.item} onClickCapture={onClickCapture}>
                <IngredientLink url={item.url_key}>
                    <Image
                        alt={item.name}
                        src={item.image}
                        height={IMAGE_HEIGHT}
                        width={IMAGE_WIDTH}
                        classes={{
                            image: classes.ingImage,
                            root: classes.imageContainer
                        }}
                    />
                </IngredientLink>

                <IngredientLink url={item.url_key}>
                    <div className={classes.name}>{item.name}</div>
                    <div className={classes.description}>{item.short_description}</div>
                </IngredientLink>
            </div>
        )
    );
};

IngredientItem.propTypes = {
    item: object,
    isLoading: bool,
    onClickCapture: func
};

export default IngredientItem;
