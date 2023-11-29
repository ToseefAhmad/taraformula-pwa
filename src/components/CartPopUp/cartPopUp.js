import PropTypes, { object } from 'prop-types';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { X as CloseIcon } from 'react-feather';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import classes from '@app/components/CartPopUp/cartPopUp.module.css';
import FreeShipping from '@app/components/FreeShipping';
import GetItBy from '@app/components/GetItBy';
import Price from '@app/components/overrides/Price';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';

const IMAGE_WIDTH = 148;
const IMAGE_HEIGHT = 129;

const CartPopUp = ({ headerRef, data }) => {
    const { isTrueMobileScreen } = useScreenSize();
    const [hover, setHover] = useState(false);
    const history = useHistory();
    const { cartItem } = data;
    const smallImage = cartItem.small_image.url || cartItem.small_image;
    const { swatch_image: swatchImage, swatch_image_configurable } = cartItem;

    const [
        ,
        {
            actions: { setCartPopUp }
        }
    ] = useAppContext();

    const swatchData =
        swatchImage && swatchImage !== 'no_selection'
            ? swatchImage
            : swatch_image_configurable && swatch_image_configurable !== 'no_selection'
            ? swatch_image_configurable
            : null;

    const swatchImageDesktop = swatchData && !isTrueMobileScreen && (
        <Image
            alt={cartItem.name}
            classes={{
                image: classes.hoverImage,
                root: classes.productImageContainer
            }}
            height={IMAGE_HEIGHT}
            resource={swatchData}
            width={IMAGE_WIDTH}
        />
    );

    const closePopUp = useCallback(() => setCartPopUp(null), [setCartPopUp]);

    const handleLinkClick = useCallback(() => {
        // Send the user to the cart page.
        history.push('/cart');
        closePopUp();
    }, [history, closePopUp]);

    const rootStyle = {
        top: headerRef.current ? headerRef.current.offsetHeight : 0
    };

    const stopTimer = val => {
        setHover(val);
    };

    const finalPriceWithQty = useMemo(() => cartItem.price_range.maximum_price.final_price.value * cartItem.quantity, [
        cartItem.price_range.maximum_price.final_price,
        cartItem.quantity
    ]);

    const regularPriceWithQty = useMemo(
        () => cartItem.price_range.maximum_price.regular_price.value * cartItem.quantity,
        [cartItem.price_range.maximum_price.regular_price.value, cartItem.quantity]
    );

    const influenceType = cartItem.influence_type_label;

    const chosenOptions = cartItem.selectedOptionLabels;
    const selectedOption =
        chosenOptions &&
        chosenOptions.map(label => (
            <p key={label.key}>
                {label.option}: {label.attributeValue}
            </p>
        ));

    useEffect(() => {
        if (!hover) {
            document.addEventListener('mousedown', closePopUp);
            // CLosing pop up after 5sec.
            const timer = setTimeout(closePopUp, 5000);
            return () => {
                clearTimeout(timer);
                document.removeEventListener('mousedown', closePopUp);
            };
        }
    }, [hover, closePopUp]);

    return (
        <div className={classes.cartPopUpWrapper} style={rootStyle}>
            <div
                onMouseEnter={() => stopTimer(true)}
                onMouseLeave={() => stopTimer(false)}
                className={classes.cartPopUpContainer}
            >
                <div className={classes.cartPopUpHeader}>
                    <span className={classes.cartPopUpTitle}>
                        <FormattedMessage id={'cartPopUp.addedToBad'} defaultMessage={'Added to Bag'} />
                    </span>
                    <Icon
                        onClick={closePopUp}
                        src={CloseIcon}
                        classes={{ icon: classes.closeIcon, root: classes.iconSpan }}
                    />
                </div>
                <div className={classes.cartPopUpContent}>
                    <div className={classes.cartPopUpImages}>
                        <Image
                            alt={cartItem.name}
                            classes={{
                                image: swatchData ? classes.imageWithHover : classes.productImage,
                                loaded: classes.imageLoaded,
                                notLoaded: classes.imageNotLoaded,
                                root: classes.productImageContainer
                            }}
                            height={IMAGE_HEIGHT}
                            resource={smallImage}
                            width={IMAGE_WIDTH}
                        />
                        {swatchImageDesktop}
                    </div>
                    <div className={classes.productInfo}>
                        <p className={classes.itemInfluenceTitle}>{influenceType}</p>
                        <p>{cartItem.name}</p>
                        {selectedOption}
                        <div className={classes.orderInfo}>
                            <div className={classes.orderQty}>
                                <span>
                                    <FormattedMessage id={'cartPopUp.qty'} defaultMessage={'QTY:'} />
                                </span>
                                <span className={classes.itemQty}>{cartItem.quantity}</span>
                            </div>
                            <div className={classes.orderPrice}>
                                <Price
                                    value={finalPriceWithQty}
                                    oldValue={regularPriceWithQty}
                                    currencyCode={cartItem.price_range.maximum_price.regular_price.currency}
                                />
                            </div>
                        </div>
                        <GetItBy />
                    </div>
                </div>
                <div className={classes.freeShipping}>
                    <FreeShipping isMiniCart={true} />
                </div>
                <div className={classes.buttonContainer}>
                    <Button onClick={handleLinkClick} priority="primary" fill="solid">
                        <FormattedMessage id={'cartPopUp.viewBag'} defaultMessage={'View Bag'} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

CartPopUp.propTypes = {
    data: object,
    headerRef: PropTypes.any
};

export default CartPopUp;
