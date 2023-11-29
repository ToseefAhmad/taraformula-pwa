import { array, func, number, shape, string } from 'prop-types';
import React, { useState } from 'react';
import { Info } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import { GalleryItemShimmer } from '@app/components/overrides/Gallery';
import Price from '@app/components/overrides/Price';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import Image from '@magento/venia-ui/lib/components/Image';

import AddToCartButton from './addToCart';
import classes from './item.module.css';

const IMAGE_HEIGHT = 375;
const IMAGE_RATIO = 1;

// Gallery switches from two columns to three at 640px.

const GalleryItem = ({ storeConfig, item, onClickCapture, handleAddComplimentaryGift }) => {
    const { item: slideItem, isSupportedProductType } = useGalleryItem({ storeConfig, item });
    const { isTrueMobileScreen } = useScreenSize();
    const IMAGE_WIDTH = isTrueMobileScreen ? 200 : 300;
    const IMAGE_WIDTHS = new Map().set(640, IMAGE_WIDTH).set(UNCONSTRAINED_SIZE_KEY, 320);

    const [isHovering, setIsHovering] = useState(false);

    if (!slideItem) {
        return <GalleryItemShimmer classes={classes} />;
    }

    const { name, price_range, small_image, swatch_image, influence_type_label, swatch_image_configurable } = slideItem;
    const { url: smallImageURL } = small_image;

    const influenceType = influence_type_label && <span className={classes.type}>{influence_type_label}</span>;

    // Load swatch image on desktop only
    const swatchData =
        swatch_image && swatch_image !== 'no_selection'
            ? swatch_image
            : swatch_image_configurable && swatch_image_configurable !== 'no_selection'
            ? swatch_image_configurable
            : null;
    const swatchImage = swatchData && !isTrueMobileScreen && (
        <Image
            alt={name}
            classes={{
                image: classes.hoverImage,
                root: classes.imageContainer
            }}
            height={IMAGE_HEIGHT}
            resource={swatchData}
            width={IMAGE_WIDTH}
            widths={IMAGE_WIDTHS}
            ratio={IMAGE_RATIO}
        />
    );
    const addButton = isSupportedProductType ? (
        <AddToCartButton item={item} isHovering={isHovering} />
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'galleryItem.unavailableProduct'}
                    defaultMessage={'Currently unavailable for purchase.'}
                />
            </p>
        </div>
    );

    return (
        <div
            className={classes.root}
            aria-live="polite"
            aria-busy="false"
            onClick={() => handleAddComplimentaryGift(item)}
            onKeyDown={() => handleAddComplimentaryGift(item)}
            onClickCapture={onClickCapture}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            role="button"
            tabIndex={0}
        >
            <div className={classes.contentWrapper}>
                <Image
                    alt={name}
                    classes={{
                        image: classes.image,
                        root: classes.imageContainer,
                        placeholder: classes.placeholder
                    }}
                    height={IMAGE_HEIGHT}
                    resource={smallImageURL}
                    widths={IMAGE_WIDTHS}
                    ratio={IMAGE_RATIO}
                />
                {swatchImage}
                <div className={classes.nameWrapper}>
                    {influenceType}
                    <span>{name}</span>
                </div>
            </div>
            <div className={classes.actionWrapper}>
                <div className={classes.price}>
                    <Price
                        value={price_range.maximum_price.final_price.value}
                        oldValue={price_range.maximum_price.regular_price.value}
                        currencyCode={price_range.maximum_price.regular_price.currency}
                    />
                </div>
                <div className={classes.actionsContainer}>{addButton}</div>
            </div>
        </div>
    );
};

GalleryItem.propTypes = {
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        swatch_image: string,
        stock_status: string.isRequired,
        type_id: string.isRequired,
        url_key: string.isRequired,
        url_suffix: string,
        sku: string.isRequired,
        price_range: shape({
            maximum_price: shape({
                regular_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired,
                final_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired,
        influence_type_label: string,
        categories: array,
        category_name_in_tile: string
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string.isRequired
    }),
    onClickCapture: func,
    handleAddComplimentaryGift: func
};

export default GalleryItem;
