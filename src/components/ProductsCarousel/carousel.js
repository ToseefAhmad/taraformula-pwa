import { array, object } from 'prop-types';
import React from 'react';
import SlickSlider from 'react-slick';

import { useCarousel as useSlickCarousel } from '@app/talons/useCarousel';
import { useCarousel } from '@magento/pagebuilder/lib/ContentTypes/Products/Carousel/useCarousel';

import GalleryItem from './item';

const Carousel = props => {
    const { settings, items } = props;

    const { storeConfig } = useCarousel();
    const { handleBeforeChange, handleAfterChange, handleOnItemClick } = useSlickCarousel();

    const galleryItems = items.map((item, index) => {
        return <GalleryItem key={index} item={item} storeConfig={storeConfig} onClickCapture={handleOnItemClick} />;
    });

    return (
        <SlickSlider {...settings} afterChange={handleAfterChange} beforeChange={handleBeforeChange}>
            {galleryItems}
        </SlickSlider>
    );
};

Carousel.propTypes = {
    settings: object.isRequired,
    items: array.isRequired
};

export default Carousel;
