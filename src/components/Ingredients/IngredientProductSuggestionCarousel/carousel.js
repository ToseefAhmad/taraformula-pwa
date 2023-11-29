import { array, object, string } from 'prop-types';
import React, { useMemo } from 'react';
import SlickSlider from 'react-slick';

import classes from '@app/components/Ingredients/IngredientProductSuggestionCarousel/carousel.module.css';
import ingredientItemClasses from '@app/components/Ingredients/IngredientProductSuggestionCarousel/ingredientItem.module.css';
import productItemClasses from '@app/components/Ingredients/IngredientProductSuggestionCarousel/productItem.module.css';
import { useCarousel } from '@app/talons/useCarousel';
import { useGallery } from '@magento/peregrine/lib/talons/Gallery/useGallery';

import IngredientItem from './ingredientItem';
import GalleryItem from './productItem';

/**
 * Renders a Gallery of items. If items is an array of nulls Gallery will render
 * a placeholder item for each.
 *
 * @params {Array} props.items an array of items to render
 */
const Carousel = ({ settings, items, type }) => {
    const talonProps = useGallery();
    const { storeConfig } = talonProps;
    const { handleBeforeChange, handleAfterChange, handleOnItemClick } = useCarousel();

    const galleryItems = useMemo(() => {
        if (type === 'product') {
            return items.map((item, index) => (
                <GalleryItem
                    key={index}
                    item={item}
                    storeConfig={storeConfig}
                    childClasses={productItemClasses}
                    onClickCapture={handleOnItemClick}
                />
            ));
        } else {
            return items.map((item, index) => (
                <IngredientItem
                    key={index}
                    item={item}
                    childClasses={ingredientItemClasses}
                    onClickCapture={handleOnItemClick}
                />
            ));
        }
    }, [items, storeConfig, type, handleOnItemClick]);

    return (
        <>
            {items.length > 2 ? (
                <div className={classes.carousel} aria-live="polite" aria-busy="false">
                    <SlickSlider beforeChange={handleBeforeChange} afterChange={handleAfterChange} {...settings}>
                        {galleryItems}
                    </SlickSlider>
                </div>
            ) : (
                <div className={classes.itemsList}>{galleryItems}</div>
            )}
        </>
    );
};

Carousel.propTypes = {
    settings: object.isRequired,
    items: array.isRequired,
    type: string
};

export default Carousel;
