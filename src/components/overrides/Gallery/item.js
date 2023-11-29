import { string, number, shape } from 'prop-types';
import React from 'react';
import { Info } from 'react-feather';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import Price from '../Price';

import AmProductLabels from '@app/components/ProductLabels';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';
import { useGalleryItem } from '@magento/peregrine/lib/talons/Gallery/useGalleryItem';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import GalleryItemShimmer from '@magento/venia-ui/lib/components/Gallery/item.shimmer';
import Image from '@magento/venia-ui/lib/components/Image';

import AddToCartButton from './addToCartButton';
import defaultClasses from './item.module.css';

// The placeholder image is 4:5, so we should make sure to size our product
// Images appropriately.
const IMAGE_HEIGHT = 375;
const IMAGE_RATIO = 1;

const GalleryItem = props => {
    const { handleLinkClick, item, isSupportedProductType } = useGalleryItem(props);
    const { isTrueMobileScreen } = useScreenSize();
    const { innerWidth } = useWindowSize();
    const IMAGE_WIDTH = innerWidth < 640 ? 160 : innerWidth < 1024 ? 320 : innerWidth < 1440 ? 160 : 320;
    const IMAGE_WIDTHS = new Map()
        .set(640, 160)
        .set(1024, 320)
        .set(1440, 160)
        .set(UNCONSTRAINED_SIZE_KEY, IMAGE_WIDTH);

    const { storeConfig } = props;

    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;

    const classes = useStyle(defaultClasses, props.classes);

    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }

    const {
        name,
        price_range,
        small_image,
        url_key,
        influence_type_label,
        swatch_image,
        swatch_image_configurable
    } = item;
    const { url: smallImageURL } = small_image;
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);
    const influenceType = influence_type_label && <span className={classes.type}>{influence_type_label}</span>;

    const addButton = isSupportedProductType ? (
        <AddToCartButton item={item} />
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
            resource={swatchData ? swatchData : smallImageURL}
            width={IMAGE_WIDTH}
            widths={IMAGE_WIDTHS}
            ratio={IMAGE_RATIO}
        />
    );

    return (
        <div className={classes.root} aria-live="polite" aria-busy="false">
            <div className={classes.contentWrapper}>
                <Link onClick={handleLinkClick} to={productLink} className={classes.images}>
                    <AmProductLabels mode="CATEGORY" itemId={item.id} productWidth={IMAGE_WIDTH} />
                    <Image
                        alt={name}
                        classes={{
                            image: swatchImage ? classes.imageWithHover : classes.image,
                            loaded: classes.imageLoaded,
                            notLoaded: classes.imageNotLoaded,
                            root: classes.imageContainer
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
    classes: shape({
        image: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        images: string,
        name: string,
        price: string,
        root: string,
        imageWithHover: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string.isRequired,
        name: string.isRequired,
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
        sku: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        swatch_image: string,
        influence_type_label: string,
        stock_status: string.isRequired,
        type_id: string.isRequired,
        url_key: string.isRequired
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string.isRequired
    })
};

export default GalleryItem;
