import { arrayOf, bool, shape, string } from 'prop-types';
import React from 'react';

import classes from '@app/components/overrides/CartPage/cartCarousel.shimmer.module.css';
import { useScreenSize } from '@app/hooks/useScreenSize';
import ItemShimmer from '@app/pageBuilder/ContentTypes/BestsellerSlider/item.shimmer';

/**
 * Shimmer component.
 *
 * @typedef CartCarouselShimmer
 * @kind functional component
 *
 * @returns {React.Element} A React component that displays a Shimmer.
 */
const Shimmer = () => {
    const { isMiniTabletScreen, isTabletScreen, isDesktopScreen } = useScreenSize();

    return (
        <>
            <div className={classes.carouselLoading}>
                <ItemShimmer
                    classes={{
                        root: classes.item,
                        imageContainer: classes.imageContainer,
                        productCategory: classes.productCategory
                    }}
                />
                <ItemShimmer
                    classes={{
                        root: classes.halfItem,
                        imageContainer: classes.imageContainer,
                        productCategory: classes.productCategory
                    }}
                />
                {(isMiniTabletScreen || isTabletScreen || isDesktopScreen) && (
                    <ItemShimmer
                        classes={{
                            root: classes.item,
                            imageContainer: classes.imageContainer,
                            productCategory: classes.productCategory
                        }}
                    />
                )}
                {isDesktopScreen && (
                    <ItemShimmer
                        classes={{
                            root: classes.item,
                            imageContainer: classes.imageContainer,
                            productCategory: classes.productCategory
                        }}
                    />
                )}
            </div>
            <div className={classes.dotsShimmer} />
        </>
    );
};

/**
 * Props for {@link Shimmer}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Slider
 * @property {String} classes.root CSS class for the slider root element
 * @property {String} classes.shimmerRoot CSS class for the slider shimmer
 * root_rectangle element
 * @property {String} minHeight CSS minimum height property
 * @property {String} showDots Whether to show navigation dots at the bottom of the slider
 * @property {String} border CSS border property
 * @property {String} borderWidth CSS border width property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
Shimmer.propTypes = {
    classes: shape({
        root: string,
        shimmerRoot: string
    }),
    minHeight: string,
    showDots: bool,
    border: string,
    borderWidth: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string)
};

export default Shimmer;
