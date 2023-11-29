import PropTypes, { shape, string } from 'prop-types';
import React, { useMemo, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { MinusFull, PlusFull } from '@app/components/Icons';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useToasts, ToastType } from '@app/hooks/useToasts';
import { useProduct } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Quantity from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';
import Image from '@magento/venia-ui/lib/components/Image';
import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Section from '@magento/venia-ui/lib/components/LegacyMiniCart/section';
import Price from '@magento/venia-ui/lib/components/Price';

import { REMOVE_ITEM_MUTATION, UPDATE_QUANTITY_MUTATION } from './cartMutations.gql';
import classes from './product.module.css';
import quantityClasses from './quantity-cart.module.css';

const IMAGE_WIDTH = 118;
const IMAGE_HEIGHT = 101;

const Product = props => {
    const { item } = props;
    const { isTrueMobileScreen } = useScreenSize();
    const { formatMessage } = useIntl();
    const { errorMessage, handleRemoveFromCart, handleUpdateItemQuantity, product, isProductUpdating } = useProduct({
        operations: {
            removeItemMutation: REMOVE_ITEM_MUTATION,
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        ...props
    });
    const [, { addToast }] = useToasts();
    const { small_image, swatch_image: swatchImage, swatch_image_configurable } = item.product;
    const { url: smallImageURL } = small_image;

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: ToastType.ERROR,
                message: formatMessage({
                    id: 'product.qtyExceeded',
                    defaultMessage: errorMessage
                })
            });
        }
    }, [formatMessage, addToast, errorMessage]);

    const { currency, name, options, quantity, stockStatus, totalPrice, urlKey, urlSuffix } = product;

    const itemClassName = isProductUpdating ? classes.itemDisabled : classes.item;

    const itemLink = useMemo(() => resourceUrl(`/${urlKey}${urlSuffix || ''}`), [urlKey, urlSuffix]);

    const influenceType = item.product.influence_type_label && (
        <div className={classes.tagLine}>{item.product.influence_type_label}</div>
    );

    const isFree = item.isFreeGift;
    const priceDisplay = useMemo(() => {
        let priceClass = classes.price;
        let display = <Price currencyCode={currency} value={totalPrice} />;
        if (isFree) {
            priceClass = classes.free;
            display = <FormattedMessage id={'priceSummary.FREE'} defaultMessage={'FREE'} />;
        }
        return <span className={priceClass}>{display}</span>;
    }, [currency, totalPrice, isFree]);

    // Load swatch image on desktop only
    const swatchData =
        swatchImage && swatchImage !== 'no_selection'
            ? swatchImage
            : swatch_image_configurable && swatch_image_configurable !== 'no_selection'
            ? swatch_image_configurable
            : null;
    const swatchImageContent = swatchData && !isTrueMobileScreen && (
        <Image
            alt={name}
            classes={{
                image: classes.hoverImage,
                root: classes.imageContainer,
                loaded: classes.imageLoaded,
                notLoaded: classes.imageNotLoaded
            }}
            height={IMAGE_HEIGHT}
            resource={swatchData ? swatchData : smallImageURL}
            width={IMAGE_WIDTH}
        />
    );

    const itemErrors =
        item.errors &&
        item.errors.map((error, id) => (
            <div key={id} className={classes.error}>
                <FormattedMessage id={'cartItem.error.' + error.message} defaultMessage={error.message} />
            </div>
        ));

    const quantityComp = !isFree ? (
        <Quantity
            itemId={item.id}
            initialValue={quantity}
            onChange={handleUpdateItemQuantity}
            classes={quantityClasses}
            decreaseIcon={MinusFull}
            increaseIcon={PlusFull}
            decreaseIconSize={15}
            increaseIconSize={15}
            revertQty={!!errorMessage}
        />
    ) : null;
    return (
        <>
            <li className={classes.root}>
                <div className={itemClassName}>
                    <Link to={itemLink} className={classes.images}>
                        <Image
                            alt={name}
                            classes={{
                                image: swatchImageContent ? classes.imageWithHover : classes.image,
                                loaded: classes.imageLoaded,
                                notLoaded: classes.imageNotLoaded,
                                root: classes.imageContainer
                            }}
                            height={IMAGE_HEIGHT}
                            resource={smallImageURL}
                        />
                        {swatchImageContent}
                    </Link>
                    <div className={classes.details}>
                        <div className={classes.tagLineMobile}>{influenceType}</div>
                        <div className={classes.name}>
                            <div className={classes.tagLineDesktop}>{influenceType}</div>
                            <Link to={itemLink}>{name}</Link>
                            <ProductOptions
                                options={options}
                                classes={{
                                    options: classes.options,
                                    optionLabel: classes.optionLabel
                                }}
                            />
                        </div>
                        {priceDisplay}
                        {stockStatus === 'OUT_OF_STOCK' ? (
                            <div className={classes.stockStatus}>
                                <span className={classes.stockStatusMessage}>
                                    {formatMessage({
                                        id: 'product.outOfStock',
                                        defaultMessage: 'Out-of-stock'
                                    })}
                                </span>
                            </div>
                        ) : quantityComp ? (
                            <div className={classes.quantity}>
                                <div className={classes.qtyLabel}>
                                    {formatMessage({
                                        id: 'cartPage.qtyLabel',
                                        defaultMessage: 'QTY:'
                                    })}
                                </div>
                                {quantityComp}
                            </div>
                        ) : null}
                        <ul className={classes.removeButton}>
                            <Section
                                text={formatMessage({
                                    id: 'cartPage.removeFromCart',
                                    defaultMessage: 'Remove'
                                })}
                                onClick={handleRemoveFromCart}
                                icon="Close"
                                classes={{
                                    text: classes.sectionText,
                                    iconContainer: classes.removeIcon,
                                    icon: classes.mainIcon,
                                    menuItem: classes.menuItem
                                }}
                            />
                        </ul>
                    </div>
                </div>
            </li>
            {itemErrors}
        </>
    );
};

Product.propTypes = {
    classes: string,
    freeItemIds: PropTypes.array,
    item: shape({
        id: string
    }).isRequired
};

export default Product;
