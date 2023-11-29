import { array, func, number, shape, string } from 'prop-types';
import React from 'react';
import { Info } from 'react-feather';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import classes from '@app/components/overrides/Gallery/item.module.css';
import Price from '@app/components/overrides/Price';
import AmProductLabels from '@app/components/ProductLabels/productLabels';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Image from '@magento/venia-ui/lib/components/Image';

import AddToCartButton from './addToCartButton';
import GalleryItemShimmer from './item.shimmer';

// The placeholder image is 4:5, so we should make sure to size our product
// Images appropriately.
const IMAGE_HEIGHT = 375;
const IMAGE_RATIO = 1;

const IS_EMPTY_AND_WHITESPACE_ONLY = /^\s*$/;

// Gallery switches from two columns to three at 640px.

const GalleryItem = ({ storeConfig, item, onClickCapture }) => {
    const { handleLinkClick, item: slideItem, isSupportedProductType } = useGalleryItem({ storeConfig, item });
    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;
    const { isTrueMobileScreen } = useScreenSize();
    const IMAGE_WIDTH = isTrueMobileScreen ? 200 : 300;
    const IMAGE_WIDTHS = new Map().set(640, IMAGE_WIDTH).set(UNCONSTRAINED_SIZE_KEY, 320);

    if (!slideItem) {
        return <GalleryItemShimmer classes={classes} />;
    }

    const {
        name,
        price_range,
        small_image,
        swatch_image,
        url_key,
        influence_type_label,
        categories,
        swatch_image_configurable
    } = slideItem;
    const { url: smallImageURL } = small_image;
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);

    const influenceType = influence_type_label && <span className={classes.type}>{influence_type_label}</span>;

    // Selecting first category
    const parentCategory =
        categories && categories.length > 0 && categories.find(category => category.is_active === true);
    // Check attribute first, if it is empty, use category name
    const categoryName =
        item.category_name_in_tile && !IS_EMPTY_AND_WHITESPACE_ONLY.test(item.category_name_in_tile)
            ? item.category_name_in_tile
            : (parentCategory && parentCategory.name && parentCategory.name.replace('Shop ', '')) || '';

    const categoryItem =
        categoryName && parentCategory ? (
            <Link to={parentCategory.url_path} className={classes.category}>
                {categoryName}
            </Link>
        ) : categoryName ? (
            <span className={classes.categoryTitle}>{categoryName}</span>
        ) : (
            <span className={classes.categoryTitle}>&#8203;</span>
        );

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
        <AddToCartButton item={slideItem} />
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
        <div className={classes.root} aria-live="polite" aria-busy="false" onClickCapture={onClickCapture}>
            <div className={classes.contentWrapper}>
                {categoryItem}
                <Link onClick={handleLinkClick} to={productLink} className={classes.images}>
                    <AmProductLabels
                        mode="CATEGORY"
                        itemId={item.id}
                        productWidth={IMAGE_WIDTHS.get(UNCONSTRAINED_SIZE_KEY)}
                    />
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
                </Link>
                <div className={classes.nameWrapper}>
                    {influenceType}
                    <Link onClick={handleLinkClick} to={productLink} className={classes.name}>
                        <span>{name}</span>
                    </Link>
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
    onClickCapture: func
};

export default GalleryItem;
