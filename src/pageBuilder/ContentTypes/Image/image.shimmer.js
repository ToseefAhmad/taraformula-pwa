import { arrayOf, shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './image.shimmer.module.css';

/**
 * Page Builder Image Shimmer component.
 *
 * @typedef ImageShimmer
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Image Shimmer.
 */
const ImageShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { marginTop, marginRight, marginBottom, marginLeft, cssClasses = [] } = props;

    const rootStyles = {
        marginTop,
        marginRight,
        marginBottom,
        marginLeft
    };

    return (
        <Shimmer
            aria-live="polite"
            aria-busy="true"
            classes={{
                root_rectangle: [classes.root, classes.shimmerRoot, ...cssClasses].join(' ')
            }}
            style={rootStyles}
        />
    );
};

/**
 * Props for {@link ImageShimmer}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Image
 * @property {String} classes.img CSS classes for the img element
 * @property {String} classes.root CSS class for the banner root element
 * @property {String} classes.shimmerRoot CSS class for the banner
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
ImageShimmer.propTypes = {
    classes: shape({
        root: string,
        shimmerRoot: string,
        img: string
    }),
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    cssClasses: arrayOf(string)
};

export default ImageShimmer;
