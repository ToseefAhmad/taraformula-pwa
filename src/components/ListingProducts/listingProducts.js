import { array, func, object, string } from 'prop-types';
import React from 'react';

import { ArrowLeft, ArrowRight } from '@app/components/Icons';
import ProductsCarousel from '@app/components/ProductsCarousel/carousel';
import { Directions, getDirection } from '@app/hooks/useDirection';

import classes from './listing.module.css';

/**
 * Custom slider prev arrow component
 */
const PrevArrow = ({ className, style, onClick }) => {
    return <ArrowLeft className={className} style={style} onClick={onClick} size={33} />;
};

/**
 * Custom slider next arrow component
 *
 */
const NextArrow = ({ className, style, onClick }) => {
    return <ArrowRight className={className} style={style} onClick={onClick} size={33} textSize={22} />;
};

const listingProducts = ({ items, title }) => {
    if (items.length === 0) {
        return null;
    }

    const slidesToShow = 2;
    const slidesToShowSmall = 1;
    const slidesToScroll = 1;
    const isRtlDirection = getDirection() === Directions.rtl;
    const currentSlides = items.length > slidesToShow ? slidesToShow : items.length;
    const productListingClass =
        items.length === 1 ? `${classes.productListing} ${classes.productListingSingle}` : classes.productListing;

    const carouselSettings = {
        slidesToShow: currentSlides,
        slidesToScroll,
        centerPadding: '18.9%',
        dotsClass: 'slick-line',
        dots: true,
        draggable: false,
        arrows: true,
        centerMode: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        rtl: isRtlDirection,
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: slidesToShowSmall,
                    slidesToScroll,
                    draggable: true,
                    arrows: false
                }
            }
        ]
    };

    return (
        <div className={classes.wrapper}>
            <div className={classes.title}>
                <h5>{title}</h5>
            </div>
            <div className={productListingClass}>
                <ProductsCarousel settings={carouselSettings} items={items} />
            </div>
        </div>
    );
};

/**
 * @type {{title: Validator<NonNullable<string>>, items: Validator<NonNullable<any[]>>}}
 */
listingProducts.propTypes = {
    items: array.isRequired,
    title: string.isRequired
};

export default listingProducts;

/**
 * Props for {@link PrevArrow}
 *
 * @typedef props
 *
 * @property {string} className class name of the button
 * @property {Object} style is an object of inline styles
 * @property {Function} onClick show next slider item
 */
PrevArrow.propTypes = {
    className: string,
    style: object,
    onClick: func
};

/**
 * Props for {@link NextArrow}
 *
 * @typedef props
 *
 * @property {string} className class name of the button
 * @property {Object} style is an object of inline styles
 * @property {Function} onClick show previous slider item
 */
NextArrow.propTypes = {
    className: string,
    style: object,
    onClick: func
};
