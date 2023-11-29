import { func, string, shape } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import defaultClasses from '@app/components/overrides/Gallery/item.module.css';
import GalleryItemShimmer from '@app/components/ProductsCarousel/item.shimmer';
import { Directions, getDirection } from '@app/hooks/useDirection';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';

// The placeholder image is 4:5, so we should make sure to size our product
// Images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map().set(640, IMAGE_WIDTH).set(UNCONSTRAINED_SIZE_KEY, 840);

const GalleryItem = ({ storeConfig, item, childClasses, onClickCapture }) => {
    const classes = useStyle(defaultClasses, childClasses);
    const { handleLinkClick, item: slideItem } = useGalleryItem({ storeConfig, item });
    const { isTrueMobileScreen } = useScreenSize();
    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;

    const dirAttribute = getDirection() === Directions.rtl && { dir: 'rtl' };

    if (!slideItem) {
        return <GalleryItemShimmer classes={classes} />;
    }

    const { name, small_image, swatch_image: swatchImage, url_key, influence_type_label } = slideItem;
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);
    const influenceType = (
        <span className={classes.influenceType} {...dirAttribute}>
            {influence_type_label}
        </span>
    );

    // Load swatch image on desktop only
    const swatchData = swatchImage && swatchImage !== 'no_selection' ? swatchImage : null;

    const swatchImageContent = swatchData && !isTrueMobileScreen && (
        <Image
            alt={name}
            classes={{
                image: classes.hoverImage,
                root: classes.imageContainer
            }}
            height={IMAGE_HEIGHT}
            resource={swatchData ? swatchData : small_image}
            width={IMAGE_WIDTH}
        />
    );

    return (
        <div className={classes.root} aria-live="polite" aria-busy="false" onClickCapture={onClickCapture}>
            <div className={classes.contentWrapper}>
                <Link onClick={handleLinkClick} to={productLink} className={classes.images}>
                    <Image
                        alt={name}
                        classes={{
                            image: swatchData ? classes.imageWithHover : classes.image,
                            loaded: classes.imageLoaded,
                            notLoaded: classes.imageNotLoaded,
                            root: classes.imageContainer
                        }}
                        height={IMAGE_HEIGHT}
                        resource={small_image}
                        widths={IMAGE_WIDTHS}
                    />
                    {swatchImageContent}
                </Link>
                <Link onClick={handleLinkClick} to={productLink}>
                    <div className={classes.titleWrapper} {...dirAttribute}>
                        {influenceType}
                        <span>{name}</span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

GalleryItem.propTypes = {
    childClasses: shape({
        root: string
    }),
    item: shape({
        name: string.isRequired,
        small_image: string.isRequired,
        swatch_image: string,
        url_key: string.isRequired,
        url_suffix: string,
        influence_type_label: string
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string.isRequired
    }),
    onClickCapture: func
};

export default GalleryItem;
