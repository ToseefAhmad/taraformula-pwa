import { arrayOf, bool, func, number, oneOf, shape, string } from 'prop-types';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import defaultClasses from '@app/components/overrides/CheckoutPage/ItemsReview/item.module.css';
import { useScreenSize } from '@app/hooks/useScreenSize';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Price from '@magento/venia-ui/lib/components/Price';

const IMAGE_WIDTH = 118;
const IMAGE_HEIGHT = 101;

/**
 * Renders a review item in order.
 *
 * @param propClasses
 * @param prices
 * @param product
 * @param quantity
 * @param configurable_options
 * @param isFreeGift
 * @param isHidden
 * @param configurableThumbnailSource
 * @returns {JSX.Element}
 */
const Item = ({
    classes: propClasses,
    prices,
    product,
    quantity,
    configurable_options,
    isFreeGift,
    isHidden,
    configurableThumbnailSource
}) => {
    const { isTrueMobileScreen } = useScreenSize();
    const classes = useStyle(defaultClasses, propClasses);
    const className = isHidden ? classes.root_hidden : classes.root;
    const configured_variant = configuredVariant(configurable_options, product);
    const influenceType = product.influence_type_label ? (
        <span className={classes.type}>{product.influence_type_label}</span>
    ) : (
        ''
    );
    const { small_image, swatch_image: swatchImage, swatch_image_configurable } = product;

    const price = prices.row_total_including_tax.value - prices.total_item_discount.value;

    const priceDisplay = useMemo(() => {
        let priceClass = classes.price;
        let display = <Price value={price} currencyCode={prices.price.currency} />;
        if (isFreeGift) {
            priceClass = classes.free;
            display = <FormattedMessage id={'priceSummary.FREE'} defaultMessage={'FREE'} />;
        }

        return <span className={priceClass}>{display}</span>;
    }, [isFreeGift, classes, price, prices]);

    const swatchData =
        swatchImage && swatchImage !== 'no_selection'
            ? swatchImage
            : swatch_image_configurable && swatch_image_configurable !== 'no_selection'
            ? swatch_image_configurable
            : null;

    const swatchImageDesktop = swatchData && !isTrueMobileScreen && (
        <Image
            alt={product.name}
            classes={{
                image: classes.hoverImage,
                root: classes.imageContainer
            }}
            height={IMAGE_HEIGHT}
            resource={swatchData}
            width={IMAGE_WIDTH}
        />
    );

    return (
        <div className={className}>
            <Link to={`/${product.url_key}`} className={classes.images}>
                <Image
                    alt={product.name}
                    classes={{
                        image: swatchData ? classes.imageWithHover : classes.image,
                        loaded: classes.imageLoaded,
                        notLoaded: classes.imageNotLoaded,
                        root: classes.imageContainer
                    }}
                    height={IMAGE_HEIGHT}
                    resource={
                        configurableThumbnailSource === 'itself' && configured_variant
                            ? configured_variant.small_image.url
                            : small_image.url
                    }
                />
                {swatchImageDesktop}
            </Link>
            <div className={classes.itemInfo}>
                <div className={classes.itemName}>
                    <p className={classes.name}>{influenceType}</p>
                    <Link to={`/${product.url_key}`}>
                        <p className={classes.linkName}>{product.name}</p>
                    </Link>
                    <ProductOptions
                        options={configurable_options}
                        classes={{
                            options: classes.options,
                            optionLabel: classes.optionLabel
                        }}
                    />
                </div>
                <span className={classes.quantity}>
                    <FormattedMessage id={'checkoutPage.qtyLabel'} defaultMessage={'QTY: '} />
                    <b>{quantity}</b>
                </span>
                {priceDisplay}
            </div>
        </div>
    );
};

Item.propTypes = {
    classes: shape({
        root: string,
        thumbnail: string,
        name: string,
        options: string,
        quantity: string,
        price: string,
        editButton: string,
        editIcon: string,
        itemInfo: string,
        itemInfoName: string
    }),
    product: shape({
        influence_type_label: string,
        name: string,
        price_range: shape({
            maximum_price: shape({
                regular_price: shape({
                    currency: string
                })
            })
        }),
        thumbnail: shape({
            url: string
        })
    }),
    id: string,
    quantity: number,
    configurable_options: arrayOf(
        shape({
            id: number,
            option_label: string,
            value_id: number,
            value_label: string
        })
    ),
    handleRemoveItem: func,
    prices: shape({
        price: shape({
            value: number,
            currency: string
        })
    }),
    configured_variant: shape({
        thumbnail: shape({
            url: string
        })
    }),
    configurableThumbnailSource: oneOf(['parent', 'itself']),
    isFreeGift: bool,
    isHidden: bool
};

Item.defaultProps = {
    classes: {},
    configurable_options: [],
    configured_variant: {
        thumbnail: {}
    },
    id: '',
    isFreeGift: false,
    isHidden: false,
    configurableThumbnailSource: 'itself',
    prices: {
        price: {},
        price_range: {
            maximum_price: {
                regular_price: {}
            }
        }
    },
    product: {
        thumbnail: {}
    },
    quantity: 0
};

export default Item;
