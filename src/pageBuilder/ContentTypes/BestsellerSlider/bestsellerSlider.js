import { useQuery } from '@apollo/client';
import { arrayOf, bool, number, oneOf, shape, string, object, func } from 'prop-types';
import React from 'react';

import { ArrowLeft, ArrowRight } from '@app/components/Icons';
import Gallery from '@app/components/overrides/Gallery';
import AmProductLabelProvider from '@app/components/ProductLabels/context';
import ProductsCarousel from '@app/components/ProductsCarousel/carousel';
import { Directions, getDirection } from '@app/hooks/useDirection';
import BestsellerShimmer from '@app/pageBuilder/ContentTypes/BestsellerSlider/bestseller.shimmer';
import { GET_PRODUCTS_BY_SKU } from '@app/pageBuilder/ContentTypes/Products/products.gql';

import classes from './bestsellerSlider.module.css';

/**
 * Sort products based on the original order
 *
 * @param {Array} skus
 * @param {Array} products
 * @returns {Array}
 */
const restoreSortOrder = (skus, products) => {
    const productsByOriginalOrder = new Map();
    products.forEach(product => {
        productsByOriginalOrder.set(product.sku, product);
    });
    return skus.map(sku => productsByOriginalOrder.get(sku)).filter(Boolean);
};

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

/**
 * Page Builder BestsellerSlider component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef BestsellerSlider
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a BestsellerSlider based on a number of products
 */
const BestsellerSlider = props => {
    const {
        appearance,
        autoplay,
        autoplaySpeed,
        arrows,
        dots,
        draggable,
        carouselMode,
        skus = [],
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = [],
        slidesToShow = 2,
        slidesToShowSmall = 1,
        slidesToScroll = 1
    } = props;

    const dynamicStyles = {
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    const { loading, error, data } = useQuery(GET_PRODUCTS_BY_SKU, {
        variables: { skus, pageSize: skus.length }
    });

    const isRtlDirection = getDirection() === Directions.rtl;

    if (error || loading || !(data || data.products || data.products.items)) {
        return <BestsellerShimmer />;
    } else if (data && data.products && data.products.items && data.products.items.length === 0) {
        return null;
    }

    const items = restoreSortOrder(skus, data.products.items);

    if (appearance === 'carousel') {
        // Settings conditions was made due to react-slick issues
        const carouselCenterMode = carouselMode === 'continuous' && items.length > slidesToShow;
        const dotsWrapper = dots => {
            return <ul>{dots}</ul>;
        };
        const currentSlides = items.length > slidesToShow ? slidesToShow : items.length;
        const carouselSettings = {
            slidesToShow: currentSlides,
            slidesToScroll,
            draggable,
            autoplay,
            autoplaySpeed,
            infinite: items.length > currentSlides,
            centerPadding: '19.15%',
            arrows,
            dots: dots,
            dotsClass: 'slick-line',
            appendDots: dotsWrapper,
            centerMode: true,
            prevArrow: <PrevArrow />,
            nextArrow: <NextArrow />,
            rtl: isRtlDirection,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: currentSlides,
                        centerPadding: '15%',
                        centerMode: true,
                        draggable: true,
                        variableWidth: false,
                        arrows: false,
                        infinite: items.length > currentSlides
                    }
                },
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: slidesToShowSmall,
                        slidesToScroll,
                        centerPadding: isRtlDirection ? '15.2%' : '11.5%',
                        centerMode: true,
                        draggable: true,
                        variableWidth: false,
                        arrows: false,
                        infinite: items.length > slidesToShowSmall
                    }
                }
            ]
        };
        const centerModeClass = carouselCenterMode ? classes.centerMode : null;
        return (
            <AmProductLabelProvider products={items} mode="CATEGORY">
                <div
                    style={dynamicStyles}
                    className={[classes.carousel, classes.bestsellerSlider, ...cssClasses, centerModeClass].join(' ')}
                >
                    <ProductsCarousel settings={carouselSettings} items={items} />
                </div>
            </AmProductLabelProvider>
        );
    }

    return (
        <div style={dynamicStyles} className={[classes.root, ...cssClasses].join(' ')}>
            <Gallery items={items} classes={{ items: classes.galleryItems }} />
        </div>
    );
};

/**
 * Props for {@link BestsellerSlider}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the BestsellerSlider
 * @property {String} classes.root CSS class for bestsellers
 * @property {String} classes.carousel CSS class for bestsellers carousel appearance
 * @property {String} classes.centerMode CSS class for bestsellers carousel appearance with center mode
 * @property {String} classes.centerModeSmall CSS class for bestsellers carousel appearance with center mode on small screen
 * @property {String} classes.galleryItems CSS class to modify child gallery items
 * @property {String} classes.error CSS class for displaying fetch errors
 * @property {String} appearance Sets bestsellers appearance
 * @property {Boolean} autoplay Whether the carousel should autoplay
 * @property {Number} autoplaySpeed The speed at which the autoplay should move the slide on
 * @property {Boolean} arrows Whether to show arrows on the slide for navigation
 * @property {Boolean} dots Whether to show navigation dots at the bottom of the carousel
 * @property {Boolean} draggable Enable scrollable via dragging on desktop
 * @property {String} carouselMode Carousel mode
 * @property {String} centerPadding Horizontal padding in centerMode
 * @property {Array} skus List of sku to load into product list
 * @property {String} textAlign Alignment of content within the products list
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 * @property {Number} slidesToShow # of slides to show at a time
 * @property {Number} slidesToShowMedium # of slides to show at a time on medium sized screens
 * @property {Number} slidesToShowSmall # of slides to show at a time on small screen
 * @property {Number} slidesToShowSmallCenterMode # of slides to show at a time on small screen in centerMode
 */
BestsellerSlider.propTypes = {
    classes: shape({
        root: string,
        carousel: string,
        centerMode: string,
        centerModeSmall: string,
        galleryItems: string,
        submenuGalleryItems: string,
        error: string,
        productsCarousel: string
    }),
    appearance: oneOf(['grid', 'carousel']),
    autoplay: bool,
    autoplaySpeed: number,
    arrows: bool,
    dots: bool,
    draggable: bool,
    carouselMode: oneOf(['default', 'continuous']),
    centerPadding: string,
    skus: arrayOf(string),
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string),
    slidesToShow: number,
    slidesToShowMedium: number,
    slidesToShowSmall: number,
    slidesToShowSmallCenterMode: number,
    slidesToScroll: number
};

export default BestsellerSlider;

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
