import { array, func, object, string } from 'prop-types';
import React from 'react';
import SlickSlider from 'react-slick';

import { ArrowLeft, ArrowRight } from '@app/components/Icons';
import { Directions, getDirection } from '@app/hooks/useDirection';
import { useCarousel as useSlickCarousel } from '@app/talons/useCarousel';
import { useCarousel } from '@magento/pagebuilder/lib/ContentTypes/Products/Carousel/useCarousel';

import Item from './Item';

const Carousel = props => {
    const { items, handleAddComplimentaryGift } = props;
    const { storeConfig } = useCarousel();
    const { handleBeforeChange, handleAfterChange, handleOnItemClick } = useSlickCarousel();

    if (!items) {
        return <h1>empty</h1>;
    }

    const PrevArrow = ({ className, style, onClick }) => {
        return <ArrowLeft className={className} style={style} onClick={onClick} size={33} />;
    };

    const NextArrow = ({ className, style, onClick }) => {
        return <ArrowRight className={className} style={style} onClick={onClick} size={33} textSize={22} />;
    };

    const isRtlDirection = getDirection() === Directions.rtl;
    const currentSlides = items.length > 4 ? 4 : items.length;
    const currentSlidesMd = items.length > 3 ? 3 : items.length;
    const currentSlidesSm = items.length > 2 ? 2 : items.length;
    const carouselSettings = {
        arrows: true,
        rtl: isRtlDirection,
        slidesToScroll: 1,
        slidesToShow: currentSlides,
        variableWidth: false,
        dots: false,
        centerMode: false,
        draggable: true,
        infinite: items.length > currentSlides,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                    dots: true,
                    centerMode: isRtlDirection && items.length > 3,
                    infinite: items.length > 1
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: currentSlidesSm,
                    arrows: false,
                    dots: true,
                    centerMode: isRtlDirection && currentSlidesSm.length >= 2,
                    infinite: items.length > currentSlidesSm
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    arrows: false,
                    dots: true,
                    slidesToShow: currentSlidesMd,
                    centerMode: isRtlDirection && currentSlidesMd.length >= 3,
                    infinite: items.length > currentSlidesMd
                }
            },
            {
                breakpoint: 1180,
                settings: {
                    slidesToShow: currentSlidesMd,
                    centerMode: isRtlDirection && currentSlidesMd.length >= 3,
                    infinite: items.length > currentSlidesMd
                }
            },
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: currentSlides,
                    infinite: items.length > currentSlides
                }
            },
            {
                breakpoint: 1536,
                settings: {
                    slidesToShow: currentSlidesMd,
                    infinite: items.length > currentSlidesMd
                }
            }
        ]
    };

    PrevArrow.propTypes = {
        className: string,
        style: object,
        onClick: func
    };

    NextArrow.propTypes = {
        className: string,
        style: object,
        onClick: func
    };

    const galleryItems = items.map((item, index) => {
        return (
            <Item
                key={index}
                item={item}
                storeConfig={storeConfig}
                onClickCapture={handleOnItemClick}
                handleAddComplimentaryGift={handleAddComplimentaryGift}
            />
        );
    });

    return (
        <SlickSlider {...carouselSettings} afterChange={handleAfterChange} beforeChange={handleBeforeChange}>
            {galleryItems}
        </SlickSlider>
    );
};

Carousel.propTypes = {
    items: array.isRequired,
    handleAddComplimentaryGift: func
};

export default Carousel;
