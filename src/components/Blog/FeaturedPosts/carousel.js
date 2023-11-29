import { func, object, string } from 'prop-types';
import React from 'react';

import { ArrowLeft, ArrowRight } from '@app/components/Icons';
import { getDirection, Directions } from '@app/hooks/useDirection';

const isRtlDirection = getDirection() === Directions.rtl;

/**
 * Custom slider prev arrow component
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
const PrevArrow = ({ className, style, onClick }) => {
    return <ArrowLeft className={className} style={style} onClick={onClick} size={33} />;
};

/**
 * Custom slider next arrow component
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
const NextArrow = ({ className, style, onClick }) => {
    return <ArrowRight className={className} style={style} onClick={onClick} size={33} textSize={22} />;
};

const dotsWrapper = dots => {
    return <ul>{dots}</ul>;
};

// Make the slider scroll RTL if in Arabic store view
const slidesToScroll = isRtlDirection ? -1 : 1;

export const carouselSettings = {
    slidesToShow: 4,
    slidesToScroll,
    draggable: true,
    autoplay: false,
    infinite: false,
    arrows: true,
    dots: true,
    rtl: isRtlDirection,
    centerMode: false,
    variableWidth: false,
    dotsClass: 'slick-line',
    appendDots: dotsWrapper,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
        {
            breakpoint: 1280,
            settings: {
                slidesToShow: 3,
                slidesToScroll,
                arrows: false
            }
        },
        {
            breakpoint: 640,
            settings: {
                slidesToShow: 1,
                slidesToScroll,
                variableWidth: true,
                arrows: false
            }
        }
    ]
};

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
