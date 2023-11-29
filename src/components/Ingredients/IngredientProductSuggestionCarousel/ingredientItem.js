import { func, string, shape } from 'prop-types';
import React from 'react';

import IngredientLink from '@app/components/Ingredients/IngredientLink';
import defaultClasses from '@app/components/overrides/Gallery/item.module.css';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';

// The placeholder image is 4:5, so we should make sure to size our product
// Images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map().set(640, IMAGE_WIDTH).set(UNCONSTRAINED_SIZE_KEY, 840);

const IngredientItem = ({ item, childClasses, onClickCapture }) => {
    const classes = useStyle(defaultClasses, childClasses);
    const { ingredient } = item;

    const { name, image, url_key } = ingredient;

    return (
        <div className={classes.root} aria-live="polite" aria-busy="false" onClickCapture={onClickCapture}>
            <div className={classes.contentWrapper}>
                <IngredientLink url={url_key} className={classes.images}>
                    <Image
                        alt={name}
                        classes={{
                            image: classes.image,
                            loaded: classes.imageLoaded,
                            notLoaded: classes.imageNotLoaded,
                            root: classes.imageContainer
                        }}
                        height={IMAGE_HEIGHT}
                        src={image}
                        widths={IMAGE_WIDTHS}
                    />
                </IngredientLink>
                <div className={classes.ingredientTitleWrapper}>
                    <IngredientLink url={url_key}>
                        <span className={classes.ingredientName}>{name}</span>
                    </IngredientLink>
                </div>
            </div>
        </div>
    );
};

IngredientItem.propTypes = {
    childClasses: shape({
        root: string
    }),
    item: shape({
        ingredient: shape({
            name: string.isRequired,
            image: string.isRequired,
            url_key: string.isRequired
        })
    }),
    onClickCapture: func
};

export default IngredientItem;
