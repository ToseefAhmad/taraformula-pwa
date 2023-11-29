import { useQuery } from '@apollo/client';
import { arrayOf, bool, number, oneOf, shape, string } from 'prop-types';
import React from 'react';

import AmProductLabelProvider from '@app/components/ProductLabels/context';
import ProductsCarousel from '@app/components/ProductsCarousel/carousel';
import SubmenuGallery from '@app/components/SubmenuGallery';
import { Directions, getDirection } from '@app/hooks/useDirection';
import { GET_PRODUCTS_BY_SKU } from '@app/pageBuilder/ContentTypes/Products/products.gql';
import Carousel from '@magento/pagebuilder/lib/ContentTypes/Products/Carousel/carousel';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Gallery from '@magento/venia-ui/lib/components/Gallery';

import defaultClasses from './products.module.css';

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
 * Page Builder Products component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Products
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Products based on a number of products
 */
const Products = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        appearance,
        autoplay,
        autoplaySpeed,
        infinite,
        arrows,
        dots,
        draggable = false,
        carouselMode,
        centerPadding,
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
        slidesToShow = 5,
        slidesToShowMedium = 4,
        slidesToShowSmall = 2,
        slidesToShowSmallCenterMode = 1,
        productsSlidesToShow = 2,
        productsSlidesToShowSmall = 1
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

    if (loading) return null;

    if (error || !(data && data.products && data.products.items && !(data.products.items.length === 0))) {
        return null;
    }

    const items = restoreSortOrder(skus, data.products.items);

    const isProductsCarousel = cssClasses.includes('productsCarousel');

    if (appearance === 'carousel') {
        // Settings conditions was made due to react-slick issues
        const carouselCenterMode = carouselMode === 'continuous' && items.length > slidesToShow;
        const carouselSmallCenterMode = carouselMode === 'continuous' && items.length > slidesToShowSmallCenterMode;
        let carouselSettings = {
            slidesToShow,
            slidesToScroll: slidesToShow,
            draggable,
            autoplay,
            autoplaySpeed,
            arrows,
            dots,
            centerMode: carouselCenterMode,
            responsive: [
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: carouselSmallCenterMode ? slidesToShowSmallCenterMode : slidesToShowSmall,
                        slidesToScroll: carouselSmallCenterMode ? slidesToShowSmallCenterMode : slidesToShowSmall,
                        centerMode: carouselSmallCenterMode,
                        ...(carouselSmallCenterMode && { centerPadding }),
                        ...{
                            infinite: items.length > slidesToShowSmall && infinite
                        }
                    }
                },
                {
                    breakpoint: 960,
                    settings: {
                        slidesToShow: slidesToShowSmall + 1,
                        slidesToScroll: slidesToShowSmall + 1
                    }
                },
                {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: slidesToShowMedium,
                        slidesToScroll: slidesToShowMedium
                    }
                }
            ],
            ...(carouselCenterMode && { centerPadding }),
            ...{ infinite: items.length > slidesToShow && infinite }
        };

        /* Settings for carousel with products on homepage */
        if (isProductsCarousel) {
            const dots = dots => {
                return <ul>{dots}</ul>;
            };
            const productsCurrentSlides = items.length > productsSlidesToShow ? productsSlidesToShow : items.length;
            carouselSettings = {
                slidesToShow: 2,
                slidesToScroll: 1,
                draggable: false,
                centerMode: false,
                autoplay,
                infinite: items.length > productsCurrentSlides && infinite,
                arrows: false,
                dots: true,
                variableWidth: false,
                dotsClass: 'slick-line',
                appendDots: dots,
                rtl: isRtlDirection,
                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: productsSlidesToShowSmall,
                            slidesToScroll: 1,
                            draggable: true,
                            centerPadding: '15%',
                            centerMode: true,
                            variableWidth: false,
                            infinite: items.length > productsSlidesToShowSmall
                        }
                    }
                ]
            };
        }

        const centerModeClass = carouselCenterMode ? classes.centerMode : null;
        const centerModeSmallClass = carouselSmallCenterMode ? classes.centerModeSmall : null;
        const productsCarouselClass = isProductsCarousel ? classes.productsCarousel : null;

        return (
            <div
                style={dynamicStyles}
                className={[
                    classes.carousel,
                    ...cssClasses,
                    centerModeClass,
                    centerModeSmallClass,
                    productsCarouselClass
                ].join(' ')}
            >
                {isProductsCarousel ? (
                    <>
                        <AmProductLabelProvider products={items} mode="CATEGORY">
                            <ProductsCarousel settings={carouselSettings} items={items} />
                        </AmProductLabelProvider>
                    </>
                ) : (
                    <Carousel settings={carouselSettings} items={items} />
                )}
            </div>
        );
    }

    // If "products" widget has "submenu-products" class, use different widget
    const gallery = cssClasses.includes('submenu-products') ? (
        <>
            <AmProductLabelProvider products={items} mode="CATEGORY">
                <SubmenuGallery
                    items={items}
                    classes={{
                        items: classes.submenuGalleryItems
                    }}
                />
            </AmProductLabelProvider>
        </>
    ) : (
        <Gallery
            items={items}
            classes={{
                items: classes.galleryItems
            }}
        />
    );

    return (
        <div style={dynamicStyles} className={[classes.root, ...cssClasses].join(' ')}>
            {gallery}
        </div>
    );
};

/**
 * Props for {@link Products}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Products
 * @property {String} classes.root CSS class for products
 * @property {String} classes.carousel CSS class for products carousel appearance
 * @property {String} classes.centerMode CSS class for products carousel appearance with center mode
 * @property {String} classes.centerModeSmall CSS class for products carousel appearance with center mode on small screen
 * @property {String} classes.galleryItems CSS class to modify child gallery items
 * @property {String} classes.error CSS class for displaying fetch errors
 * @property {String} appearance Sets products appearance
 * @property {Boolean} autoplay Whether the carousel should autoplay
 * @property {Number} autoplaySpeed The speed at which the autoplay should move the slide on
 * @property {Boolean} infinite Whether to infinitely scroll the carousel
 * @property {Boolean} arrows Whether to show arrows on the slide for navigation
 * @property {Boolean} dots Whether to show navigation dots at the bottom of the carousel
 * @property {Boolean} draggable Enable scrollable via dragging on desktop
 * @property {String} carouselMode Carousel mode
 * @property {String} centerPadding Horizontal padding in centerMode
 * @property {Array} skus List of product skus to load into product list
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
Products.propTypes = {
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
    infinite: bool,
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
    productsSlidesToShow: number,
    productsSlidesToShowSmall: number
};

export default Products;
