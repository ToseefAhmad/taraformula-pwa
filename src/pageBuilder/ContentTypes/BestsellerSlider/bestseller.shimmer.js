import { arrayOf, bool, shape, string } from 'prop-types';
import React from 'react';

import { useScreenSize } from '@app/hooks/useScreenSize';
import classes from '@app/pageBuilder/ContentTypes/BestsellerSlider/bestseller.shimmer.module.css';
import ItemShimmer from '@app/pageBuilder/ContentTypes/BestsellerSlider/item.shimmer';

/**
 * Page Builder Bestseller Shimmer component.
 *
 * @typedef BestsellerShimmer
 * @kind functional component
 *
 * @returns {React.Element} A React component that displays a Bestseller Shimmer.
 */
const BestsellerShimmer = () => {
    const { isTabletScreen, isDesktopScreen } = useScreenSize();

    return (
        <>
            <div className={classes.carouselLoading}>
                <ItemShimmer classes={{ root: classes.mobileFullWidth }} />
                <ItemShimmer classes={{ root: classes.desktopFullWidth }} />
                {(isDesktopScreen || isTabletScreen) && (
                    <>
                        <ItemShimmer classes={{ root: classes.desktopFullWidth }} />
                        <ItemShimmer />
                    </>
                )}
            </div>
            <div className={classes.dotsShimmer} />
        </>
    );
};

/**
 * Props for {@link BestsellerShimmer}
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
BestsellerShimmer.propTypes = {
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

export default BestsellerShimmer;
