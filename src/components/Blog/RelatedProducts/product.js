import { bool, number, shape, string } from 'prop-types';
import React from 'react';
import { Info } from 'react-feather';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import Price from '@app/components/overrides/Price';
import AddToCartButton from '@app/components/ProductsCarousel/addToCartButton';
import GalleryItemShimmer from '@app/components/ProductsCarousel/item.shimmer';
import { getDirection, Directions } from '@app/hooks/useDirection';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Image from '@magento/venia-ui/lib/components/Image';

import classes from './item.module.css';

// The placeholder image is 4:5, so we should make sure to size our product images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map().set(640, IMAGE_WIDTH).set(UNCONSTRAINED_SIZE_KEY, 840);

const Product = props => {
    const { item } = useGalleryItem(props);
    const { storeConfig, dragging } = props;
    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;
    const { isTrueMobileScreen } = useScreenSize();

    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }

    const isRtlDirection = getDirection() === Directions.rtl;
    const {
        name,
        price_range,
        small_image,
        swatch_image,
        url_key,
        influence_type_label,
        is_salable,
        category_name_in_tile: categoryName,
        swatch_image_configurable
    } = item;

    const { url: smallImageURL } = small_image;
    let { url: swatchImage } = swatch_image;

    if (swatchImage.indexOf('/placeholder/') !== -1) {
        swatchImage = 'no_selection';
    }

    // Load swatch image on desktop only
    const swatchData =
        swatchImage && swatchImage !== 'no_selection'
            ? swatchImage
            : swatch_image_configurable && swatch_image_configurable !== 'no_selection'
            ? swatch_image_configurable
            : null;
    const swatchContent = swatchData && !isTrueMobileScreen && (
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
        />
    );

    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);
    const influenceType = influence_type_label ? <span className={classes.type}>{influence_type_label}</span> : '';
    // Slider drag fix on links
    const dragHandler = e => {
        if (dragging) {
            e.preventDefault();
        }
    };
    const categoryNameInTile = isRtlDirection ? (
        <span className={classes.categoryNameInTitle}>{categoryName}</span>
    ) : (
        ''
    );

    // TAR-131 Add to cart expects swatch_image to be a string
    const addToCartItemSwatchImage =
        typeof swatchImage === 'string' && swatchImage !== 'no_selection' ? swatchImage : '';
    const itemWithUid = { ...item, uid: item.id, swatch_image: addToCartItemSwatchImage };

    const addButton = is_salable ? (
        <div className={classes.addToCart}>
            <AddToCartButton item={itemWithUid} />
        </div>
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
        <div className={classes.root} aria-live="polite" aria-busy="false">
            <div className={classes.contentWrapper}>
                {categoryNameInTile}
                <Link onClick={dragHandler} to={productLink} className={classes.images}>
                    <Image
                        alt={name}
                        classes={{
                            image: classes.image,
                            loaded: classes.imageLoaded,
                            notLoaded: classes.imageNotLoaded,
                            root: classes.imageContainer
                        }}
                        height={IMAGE_HEIGHT}
                        resource={smallImageURL}
                        widths={IMAGE_WIDTHS}
                    />
                    {swatchContent}
                </Link>
                <div className={classes.nameWrapper}>
                    {influenceType}
                    <Link onClick={dragHandler} to={productLink} className={classes.name}>
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

Product.propTypes = {
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string.isRequired
    }),
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        swatch_image: string.isRequired,
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
        category_name_in_tile: string
    }),
    dragging: bool
};

export default Product;
