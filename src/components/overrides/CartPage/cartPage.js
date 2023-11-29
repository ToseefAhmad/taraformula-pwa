import { useQuery } from '@apollo/client';
import classnames from 'classnames';
import { objectOf, object, string, func } from 'prop-types';
import React, { useEffect } from 'react';
import { Check } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import Icon from '../Icon';

import ComplimentaryGift from '@app/components/CartPage/ComplimentaryGift';
import { useComplimentaryGift } from '@app/components/CartPage/ComplimentaryGift/useComplimentaryGift';
import EmptyCart from '@app/components/CartPage/EmptyCart';
import { UseCityModal } from '@app/components/CityModal/useCityModal';
import { ArrowLeft, ArrowRight } from '@app/components/Icons';
import Shimmer from '@app/components/overrides/CartPage/cartCarousel.shimmer';
import AmProductLabelProvider from '@app/components/ProductLabels/context';
import ProductsCarousel from '@app/components/ProductsCarousel/carousel';
import { useAppContext } from '@app/context/App';
import { Directions, getDirection } from '@app/hooks/useDirection';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useToasts } from '@magento/peregrine';
import { useCartTrigger } from '@magento/peregrine/lib/talons/Header/useCartTrigger';
import { useStyle } from '@magento/venia-ui/lib/classify';
import PriceSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary';
import ProductListing from '@magento/venia-ui/lib/components/CartPage/ProductListing';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { GET_ITEM_COUNT_QUERY } from '@magento/venia-ui/lib/components/Header/cartTrigger.gql';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './cartPage.module.css';
import PriceAdjustments from './PriceAdjustments/priceAdjustments';
import { GET_PRODUCTS_BY_SKU } from './productsForQarousel.ggl';
import { useCartPage } from './useCartPage.js';

const CheckIcon = <Icon size={20} src={Check} />;

/**
 * Structural page component for the shopping cart.
 * This is the main component used in the `/cart` route in Venia.
 * It uses child components to render the different pieces of the cart page.
 *
 * @see {@link https://venia.magento.com/cart}
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides for the component.
 * See [cartPage.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/cartPage.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import CartPage from "@magento/venia-ui/lib/components/CartPage";
 */

/**
 * Custom slider prev arrow component
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
const PrevArrow = ({ className, style, onClick }) => {
    return <ArrowLeft className={className} style={style} onClick={onClick} size={33} />;
};

/**
 * Custom slider next arrow component
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
const NextArrow = ({ className, style, onClick }) => {
    return <ArrowRight className={className} style={style} onClick={onClick} size={33} textSize={22} />;
};
const CartPage = props => {
    const talonProps = useCartPage();

    const {
        cartItems,
        hasItems,
        isCartUpdating,
        fetchCartDetails,
        onAddToWishlistSuccess,
        setIsCartUpdating,
        shouldShowLoadingIndicator,
        wishlistSuccessProps,
        isCartLoaded,
        hasOutOfStock
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const { isDesktopXlScreen } = useScreenSize();
    const [{ isRestoringCart }] = useAppContext();
    const { isOpen } = UseCityModal();
    const {
        showModal: showComplimentaryGiftModal,
        setShowModal: setShowComplimentaryGiftModal,
        complimentaryGiftData,
        setComplimentaryGiftModalSeen,
        handleAddComplimentaryGift
    } = useComplimentaryGift(setIsCartUpdating);

    useEffect(() => {
        if (wishlistSuccessProps) {
            addToast({ ...wishlistSuccessProps, icon: CheckIcon });
        }
    }, [addToast, wishlistSuccessProps]);

    const { itemCount } = useCartTrigger({
        queries: {
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        }
    });

    const crosselProducts = cartItems.map(item =>
        item.product.crosssell_products.map(crosselProduct => crosselProduct.sku)
    );
    const skus = crosselProducts.flat();

    const { loading, error, data } = useQuery(GET_PRODUCTS_BY_SKU, {
        variables: { skus, pageSize: skus.length > 0 ? skus.length : 1 }
    });

    if (loading || !isCartLoaded || isRestoringCart) return null;

    if (error || data.products.items.length === 0) {
        return null;
    }

    if (!hasItems && isCartLoaded && !loading && data) {
        return <EmptyCart />;
    }

    const items = data.products.items;

    const dotsWrapper = dots => {
        return <ul>{dots}</ul>;
    };

    const isRtlDirection = getDirection() === Directions.rtl;
    const currentSlides = items.length > 4 ? 4 : items.length;
    const currentSlidesMd = items.length > 3 ? 3 : items.length;
    const currentSlidesSm = items.length > 2 ? 2 : items.length;
    const carouselSettings = {
        arrows: true,
        rtl: isRtlDirection,
        slidesToScroll: 1,
        slidesToShow: currentSlides,
        variableWidth: false,
        dots: true,
        centerMode: false,
        draggable: true,
        infinite: items.length > currentSlides,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        dotsClass: 'slick-line',
        appendDots: dotsWrapper,
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    variableWidth: !isRtlDirection,
                    arrows: false,
                    centerMode: isRtlDirection && items.length > 1,
                    infinite: items.length > 1
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: currentSlidesSm,
                    arrows: false,
                    centerMode: isRtlDirection && currentSlidesSm.length >= 2,
                    variableWidth: !isRtlDirection,
                    infinite: items.length > currentSlidesSm
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    arrows: false,
                    slidesToShow: currentSlidesMd,
                    centerMode: isRtlDirection && currentSlidesMd.length >= 3,
                    infinite: items.length > currentSlidesMd
                }
            },
            {
                breakpoint: 1180,
                settings: {
                    slidesToShow: currentSlidesMd,
                    centerMode: isRtlDirection && currentSlidesMd.length >= 3,
                    infinite: items.length > currentSlidesMd
                }
            },
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: currentSlides,
                    infinite: items.length > currentSlides
                }
            },
            {
                breakpoint: 1536,
                settings: {
                    slidesToShow: currentSlidesMd,
                    infinite: items.length > currentSlidesMd
                }
            }
        ]
    };

    if (shouldShowLoadingIndicator) {
        return fullPageLoadingIndicator;
    }
    const priceAdjustments = hasItems ? <PriceAdjustments setIsCartUpdating={setIsCartUpdating} /> : null;
    const priceSummary = hasItems ? (
        <PriceSummary
            isDisabled={hasOutOfStock}
            isUpdating={isCartUpdating}
            setShowComplimentaryGiftModal={setShowComplimentaryGiftModal}
        >
            {priceAdjustments}
        </PriceSummary>
    ) : null;
    const crossSellBlock = cartItems.length > 0 && (
        <div className={[classes.carousel, classes.crossellerSlider].join(' ')}>
            <div className={classes.crossellerTitle}>
                <FormattedMessage id={'cartPage.CrosselCarousel'} defaultMessage={'You may also like... '} />
            </div>
            {loading || isCartUpdating ? (
                <Shimmer />
            ) : (
                <AmProductLabelProvider products={items} mode="CATEGORY" specialWidth={200}>
                    <ProductsCarousel settings={carouselSettings} items={items} />
                </AmProductLabelProvider>
            )}
        </div>
    );
    const itemsInCartMessage = formatMessage(
        {
            id: 'cartPage.itemsInCart',
            defaultMessage: '{products} Products'
        },
        { products: itemCount }
    );

    // So that this block will maintain the same position as it was, before opening modal
    const summaryContainerStyleModalOpened = isOpen
        ? {
              top: window.scrollY
          }
        : {};

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'cartPage.title',
                    defaultMessage: 'My Shopping Bag'
                })}
            </StoreTitle>
            <ComplimentaryGift
                showModal={showComplimentaryGiftModal}
                setShowModal={setShowComplimentaryGiftModal}
                complimentaryGiftData={complimentaryGiftData}
                setComplimentaryGiftModalSeen={setComplimentaryGiftModalSeen}
                handleAddComplimentaryGift={handleAddComplimentaryGift}
            />
            <div className={classes.body}>
                <div className={classes.itemsWrapper}>
                    <div className={classes.heading_container}>
                        <h3 className={classes.heading}>
                            <FormattedMessage id={'cartPage.heading'} defaultMessage={'My Shopping Bag'} />
                        </h3>
                        <div className={classes.itemsInCart}>{itemsInCartMessage}</div>
                    </div>
                    <div className={classes.items_container}>
                        <ProductListing
                            onAddToWishlistSuccess={onAddToWishlistSuccess}
                            setIsCartUpdating={setIsCartUpdating}
                            fetchCartDetails={fetchCartDetails}
                        />
                    </div>
                </div>
                <div
                    className={classnames(classes.summary_container, isOpen ? classes.modalOpen : '')}
                    style={summaryContainerStyleModalOpened}
                >
                    <h5 className={classes.summaryTitle}>
                        <FormattedMessage id={'priceSummary.orderSummary'} defaultMessage={'Order Summary'} />
                    </h5>
                    <div className={classes.summary_contents}>{priceSummary}</div>
                    {hasOutOfStock && !loading && !isCartUpdating && (
                        <div className={classes.stockStatusError}>
                            <FormattedMessage
                                id={'cartPage.stockStatusMessage'}
                                defaultMessage={'The requested qty is not available, please update your Cart.'}
                            />
                        </div>
                    )}
                </div>
                {isDesktopXlScreen && crossSellBlock}
            </div>
            {!isDesktopXlScreen && crossSellBlock}
        </div>
    );
};

CartPage.propTypes = {
    classes: objectOf(string)
};

export default CartPage;

/**
 * Props for {@link PrevArrow}
 *
 * @typedef props
 *
 * @property {string} className class name of the button
 * @property {Object} style is an object of inline styles
 * @property {Function} onClick show next slider item
 */
PrevArrow.propTypes = {
    className: string,
    style: object,
    onClick: func
};

/**
 * Props for {@link NextArrow}
 *
 * @typedef props
 *
 * @property {string} className class name of the button
 * @property {Object} style is an object of inline styles
 * @property {Function} onClick show previous slider item
 */
NextArrow.propTypes = {
    className: string,
    style: object,
    onClick: func
};
