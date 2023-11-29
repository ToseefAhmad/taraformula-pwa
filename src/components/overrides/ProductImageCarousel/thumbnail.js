import { bool, func, number, shape, string } from 'prop-types';
import React, { useMemo } from 'react';

import { useWindowSize } from '@magento/peregrine';
import { useThumbnail } from '@magento/peregrine/lib/talons/ProductImageCarousel/useThumbnail';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';

import defaultClasses from './thumbnail.module.css';

const DEFAULT_THUMBNAIL_HEIGHT = 89;
const DEFAULT_THUMBNAIL_WIDTH = 102;

/**
 * The Thumbnail Component is used for showing thumbnail preview image for ProductImageCarousel
 * Shows up only in desktop devices
 *
 * @typedef Thumbnail
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns {React.Element} React thumbnail component that displays product thumbnail
 */
const Thumbnail = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {
        isActive,
        item: { file, label },
        onClickHandler,
        itemIndex
    } = props;

    const talonProps = useThumbnail({
        onClickHandler,
        itemIndex
    });

    const { handleClick } = talonProps;

    const windowSize = useWindowSize();
    const isDesktop = windowSize.innerWidth >= 1024;

    const thumbnailImage = useMemo(() => {
        if (!isDesktop) {
            return null;
        }

        return file ? (
            <Image
                key={'thumbnail-' + props.id}
                alt={label || 'product-image-' + props.id}
                classes={{ image: classes.image, root: classes.imageRoot }}
                height={DEFAULT_THUMBNAIL_HEIGHT}
                resource={file}
                width={DEFAULT_THUMBNAIL_WIDTH}
            />
        ) : (
            <Image
                key={'thumbnail-' + props.id}
                alt={label || 'product-image-' + props.id}
                classes={{ image: classes.image, root: classes.imageRoot }}
                src={transparentPlaceholder}
            />
        );
    }, [isDesktop, file, props.id, label, classes.image, classes.imageRoot]);

    return (
        <span
            className={isActive ? classes.rootSelected : classes.root}
            onClick={handleClick}
            role="button"
            aria-hidden="true"
        >
            {thumbnailImage}
        </span>
    );
};

/**
 * Props for {@link Thumbnail}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Thumbnail component
 * @property {string} classes.root classes for root container
 * @property {string} classes.rootSelected classes for the selected thumbnail item
 * @property {bool} isActive is image associated is active in carousel
 * @property {string} item.label label for image
 * @property {string} item.file filePath of image
 * @property {number} itemIndex index number of thumbnail
 * @property {func} onClickHandler A callback for handling click events on thumbnail
 */
Thumbnail.propTypes = {
    id: string,
    classes: shape({
        root: string,
        rootSelected: string
    }),
    isActive: bool,
    item: shape({
        label: string,
        file: string.isRequired
    }),
    itemIndex: number,
    onClickHandler: func.isRequired
};

export default Thumbnail;
