import { func, instanceOf, number, oneOfType, string } from 'prop-types';
import React from 'react';

import { useResourceImage } from '@magento/peregrine/lib/talons/Image/useResourceImage';

import { generateSrcset, generateUrl } from './util/imageUtils';

/**
 * Renders a Magento resource image.
 *
 * @param {string}   alt the alt attribute to apply to the image.
 * @param {string}   className the class to apply to this image.
 * @param {func}     handleError the function to call if the image fails to load.
 * @param {func}     handleLoad the function to call if the image successfully loads.
 * @param {number}   height the height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {string}   resource the Magento path to the image ex: /v/d/vd12-rn_main_2.jpg
 * @param {string}   type the Magento image type ("image-category" / "image-product"). Used to build the resource URL.
 * @param {number}   width the intrinsic width of the image & the width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {Map}      widths a map of breakpoints to possible widths used to create the img's sizes attribute.
 * @param {number}   ratio is the image width to height ratio. Defaults to 4/5.
 * @param rest
 */
const ResourceImage = ({
    alt,
    className,
    handleError,
    handleLoad,
    height,
    resource,
    type,
    width,
    widths,
    ratio,
    ...rest
}) => {
    const { sizes, src, srcSet } = useResourceImage({
        generateSrcset,
        generateUrl,
        height,
        resource,
        type,
        width,
        widths,
        ratio
    });

    // Note: Attributes that are allowed to be overridden must appear before the spread of `rest`.
    return (
        <img
            loading="lazy"
            {...rest}
            alt={alt}
            className={className}
            onError={handleError}
            onLoad={handleLoad}
            sizes={sizes}
            src={src}
            srcSet={srcSet}
            width={width}
        />
    );
};

ResourceImage.propTypes = {
    alt: string.isRequired,
    className: string,
    handleError: func,
    handleLoad: func,
    resource: string.isRequired,
    height: oneOfType([number, string]),
    type: string,
    width: oneOfType([number, string]),
    widths: instanceOf(Map),
    ratio: number
};

ResourceImage.defaultProps = {
    type: 'image-product'
};

export default ResourceImage;
