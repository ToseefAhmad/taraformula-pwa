import { array, bool, func, number, object, shape, string } from 'prop-types';
import React from 'react';
import SlickSlider from 'react-slick';

import { ArrowLeft, ArrowRight } from '@app/components/Icons';
import YotpoItem from '@app/components/Yotpo/yotpoItem';
import classes from '@app/components/Yotpo/yotpoSlider.module.css';
import { Directions, getDirection } from '@app/hooks/useDirection';
import { useCarousel } from '@magento/pagebuilder/lib/ContentTypes/Products/Carousel/useCarousel';

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

const YotpoSlider = ({ items, config, isProductPage }) => {
    const { storeConfig } = useCarousel();
    const currentSlides = items.length > config.slidesToShow ? config.slidesToShow : items.length;
    const currentSlidesXl = items.length > config.slidesToShowSmall + 4 ? config.slidesToShowSmall + 4 : items.length;
    const currentSlidesLg = items.length > config.slidesToShowSmall + 3 ? config.slidesToShowSmall + 3 : items.length;
    const currentSlidesMd = items.length > config.slidesToShowSmall + 2 ? config.slidesToShowSmall + 2 : items.length;
    const currentSlidesXs = items.length > config.slidesToShowSmall + 1 ? config.slidesToShowSmall + 1 : items.length;
    const isRtlDirection = getDirection() === Directions.rtl;

    const dotsWrapper = dots => {
        return <ul>{dots}</ul>;
    };

    const homepageResponsiveConfig = [
        {
            breakpoint: 1300,
            settings: {
                slidesToShow: currentSlidesXl,
                infinite: items.length > currentSlidesXl,
                draggable: true,
                arrows: true,
                dots: false
            }
        },
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: currentSlidesLg,
                infinite: items.length > currentSlidesLg,
                draggable: true,
                arrows: true,
                dots: false
            }
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: currentSlidesMd,
                infinite: items.length > currentSlidesMd,
                draggable: true,
                arrows: false,
                dots: true
            }
        },
        {
            breakpoint: 640,
            settings: {
                slidesToShow: currentSlidesXs,
                infinite: items.length > currentSlidesXs,
                draggable: true,
                arrows: false,
                dots: true
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: config.slidesToShowSmall,
                infinite: items.length > config.slidesToShowSmall,
                variableWidth: false,
                draggable: true,
                arrows: false,
                dots: true,
                centerMode: true,
                centerPadding: '15%'
            }
        }
    ];
    const footerResponsiveConfig = [
        {
            breakpoint: 640,
            settings: {
                slidesToShow: config.slidesToShowSmall,
                infinite: items.length > config.slidesToShowSmall,
                centerPadding: config.centerMode ? '7.5%' : '',
                arrows: false
            }
        }
    ];
    const productResponsiveConfig = [
        {
            breakpoint: 1300,
            settings: {
                slidesToShow: 3,
                infinite: items.length > 3,
                draggable: true,
                arrows: true,
                dots: true,
                centerPadding: '10%'
            }
        },
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                infinite: items.length > 3,
                draggable: true,
                arrows: true,
                dots: true,
                centerMode: true,
                centerPadding: '10%'
            }
        },
        {
            breakpoint: 640,
            settings: {
                slidesToShow: currentSlidesXs,
                infinite: items.length > currentSlidesXs,
                draggable: true,
                arrows: false,
                dots: true,
                centerMode: true,
                centerPadding: '15%'
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: config.slidesToShowSmall,
                infinite: items.length > config.slidesToShowSmall,
                draggable: true,
                arrows: false,
                dots: true,
                centerMode: true,
                centerPadding: '18%'
            }
        }
    ];

    const responsiveConfig = isProductPage
        ? productResponsiveConfig
        : !config.centerMode
        ? homepageResponsiveConfig
        : footerResponsiveConfig;

    const settings = {
        slidesToShow: isProductPage ? 2 : currentSlides,
        slidesToScroll: 1,
        draggable: true,
        infinite: isProductPage ? items.length > 2 : items.length > currentSlides,
        arrows: config.arrows,
        dots: config.dots,
        variableWidth: false,
        dotsClass: 'slick-line',
        appendDots: dotsWrapper,
        centerMode: isProductPage ? true : config.centerMode,
        centerPadding: isProductPage ? '19.5%' : config.centerMode ? '16%' : '',
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        rtl: isRtlDirection,
        responsive: responsiveConfig
    };

    const sliderClassBasic = !config.centerMode ? classes.slider : [classes.slider, classes.centeredSlider].join(' ');
    const sliderClass = !isProductPage
        ? sliderClassBasic
        : [classes.slider, classes.sliderProduct, classes.centeredSlider].join(' ');
    const itemClass = isProductPage ? 'productImage' : !config.centerMode ? 'image' : 'centeredImage';

    const yotpoItems = items.map((item, index) => {
        return (
            <YotpoItem
                key={index}
                item={item}
                storeConfig={storeConfig}
                config={config}
                itemClass={itemClass}
                isProductPage={isProductPage}
            />
        );
    });

    return (
        <div aria-live="polite" aria-busy="false" className={sliderClass}>
            <SlickSlider {...settings}>{yotpoItems}</SlickSlider>
        </div>
    );
};

YotpoSlider.propTypes = {
    items: array,
    config: shape({
        slidesToShow: number,
        slidesToShowSmall: number,
        centerMode: bool,
        arrows: bool,
        dots: bool
    }),
    isProductPage: bool
};

YotpoSlider.defaultProps = {
    items: [],
    config: {
        slidesToShow: 6,
        slidesToShowSmall: 1,
        centerMode: false,
        arrows: true,
        dots: false
    },
    isProductPage: false
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

export default YotpoSlider;
