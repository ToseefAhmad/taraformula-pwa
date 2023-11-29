import { func, instanceOf, number, oneOfType, string, any } from 'prop-types';
import React from 'react';

import { useResourceImage } from '@magento/peregrine/lib/talons/Image/useResourceImage';
import { generateSrcset, generateUrl } from '@magento/peregrine/lib/util/imageUtils';

import ImageZoom from './imageZoom';

/**
 * Renders a Magento resource image.
 *
 * @param {string}   props.alt the alt attribute to apply to the image.
 * @param {string}   props.className the class to apply to this image.
 * @param {Func}     props.handleError the function to call if the image fails to load.
 * @param {Func}     props.handleLoad the function to call if the image successfully loads.
 * @param {number}   props.height the height to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {string}   props.resource the Magento path to the image ex: /v/d/vd12-rn_main_2.jpg
 * @param {string}   props.type the Magento image type ("image-category" / "image-product"). Used to build the resource URL.
 * @param {number}   props.width the intrinsic width of the image & the width to request for the fallback image for browsers that don't support srcset / sizes.
 * @param {Map}      props.widths a map of breakpoints to possible widths used to create the img's sizes attribute.
 * @param {number}   props.ratio is the image width to height ratio. Defaults to 4/5.
 */
const ResourceImage = props => {
    const {
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
        zoom,
        lensSize,
        id,
        idx,
        moveLens,
        lensRef,
        zooming,
        setZooming,
        notImageSlide,
        imageRef,
        ...rest
    } = props;

    const talonProps = useResourceImage({
        generateSrcset,
        generateUrl,
        height,
        resource,
        type,
        width,
        widths,
        ratio
    });

    const currentImageRef = notImageSlide ? null : ref => (imageRef.current[idx] = ref);

    const { sizes, src, srcSet } = talonProps;

    const onMouseMoveHandler = e => {
        if (notImageSlide) {
            () => undefined;
        } else {
            moveLens(e);
        }
    };

    const onMouseEnterHandler = () => {
        if (notImageSlide) {
            () => undefined;
        } else {
            setZooming(true);
        }
    };

    const onMouseLeaveHandler = () => {
        if (notImageSlide) {
            () => undefined;
        } else {
            setZooming(false);
        }
    };

    return zoom ? (
        <>
            <ImageZoom
                lensSize={lensSize}
                lensRef={ref => (lensRef.current[idx] = ref)}
                moveLens={moveLens}
                setZooming={setZooming}
                zooming={zooming}
                onLensClick={rest.onClick}
            >
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
                    ref={currentImageRef}
                    id={id}
                    onMouseMove={e => {
                        onMouseMoveHandler(e);
                    }}
                    onMouseEnter={() => onMouseEnterHandler()}
                    onMouseLeave={() => onMouseLeaveHandler()}
                />
            </ImageZoom>
        </>
    ) : (
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
            id={id}
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
    ratio: any,
    zoom: any,
    lensSize: any,
    id: any,
    idx: any,
    moveLens: any,
    lensRef: any,
    zooming: any,
    setZooming: any,
    notImageSlide: any,
    imageRef: any
};

ResourceImage.defaultProps = {
    type: 'image-product'
};

export default ResourceImage;
