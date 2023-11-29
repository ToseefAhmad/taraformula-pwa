import { Form } from 'informed';
import { number, shape, string } from 'prop-types';
import React, { createContext, Fragment, Suspense, useContext, useState, useCallback } from 'react';
import { Info } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import ReactVideoPlayer from 'react-player/lazy';

import Price from '../Price';

import CityCarriers from '@app/components/CityCarriers';
import { VideoPlay } from '@app/components/Icons';
import Image from '@app/components/ImageZoom';
import ResultZoom from '@app/components/ImageZoom/resultZoom';
import { useImageZoom } from '@app/components/ImageZoom/useImageZoom';
import IngredientsBlock from '@app/components/Ingredients/IngredientProductPage/ingredientsBlock';
import ListingProducts from '@app/components/ListingProducts';
import Modal from '@app/components/Modal/modal';
import { QuantityFields } from '@app/components/overrides/CartPage/ProductListing/quantity';
import StickyBlock from '@app/components/overrides/ProductFullDetail/blocks/stickyBlock';
import { useProductFullDetail } from '@app/components/overrides/ProductFullDetail/useProductFullDetail';
import Carousel from '@app/components/overrides/ProductImageCarousel';
import AmProductLabelProvider from '@app/components/ProductLabels/context';
import ProductRichSnippet from '@app/components/ProductRichSnippet/productRichSnippet';
import TabbyPromo from '@app/components/TabbyPromo';
import YotpoReviews from '@app/components/Yotpo/YotpoReviews';
import YotpoStars from '@app/components/Yotpo/YotpoStars';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { ProductOptionsShimmer } from '@magento/venia-ui/lib/components/ProductOptions';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import ProductFAQ from './blocks/productFAQ';
import ProductAccordion from './productAccordion';
import defaultClasses from './productFullDetail.module.css';

const Options = React.lazy(() => import('@magento/venia-ui/lib/components/ProductOptions'));

// Correlate a GQL error message to a field. GQL could return a longer error
// String but it may contain contextual info such as product id. We can use
// Parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};

const CMS_BLOCK_ID_YOTPO = 'yotpo_instagram_product';

const ProductContext = createContext();
const { Provider } = ProductContext;

const ProductFullDetail = props => {
    const { product } = props;

    const talonProps = useProductFullDetail({ product });
    const [showModal, setShowModal] = useState(false);
    const [activeItemIndex, setActiveItemIndex] = useState();
    const { imageRef, resultRef, lensRef, moveLens, setZooming, zooming } = useImageZoom({
        activeImageRefIndex: activeItemIndex
    });

    const {
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isAddToCartDisabled,
        isSupportedProductType,
        mediaGalleryEntries,
        productDetails,
        selectedOptionLabels,
        maxQty
    } = talonProps;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const [isVideoLoaded, setVideoLoaded] = useState(false);

    const handleVideoLoading = useCallback(() => {
        setVideoLoaded(true);
    }, [setVideoLoaded]);

    let howToApplyData = null;

    if (product.how_to_apply_video) {
        howToApplyData = mediaGalleryEntries.find(item => item.types.includes('how_to_apply_video'));
    }

    // Check if product is on sale or not
    let isProductOnSale = false;
    const regularPrice = product.price_range.maximum_price.regular_price.value;
    const finalPrice = product.price_range.maximum_price.final_price.value;

    if (regularPrice && regularPrice > finalPrice) {
        isProductOnSale = true;
    }
    const afterTitleClass = isProductOnSale ? classes.afterTitleSale : classes.afterTitle;

    const howToApplyVideo =
        howToApplyData &&
        (isVideoLoaded ? (
            howToApplyData.video_content && (
                <ReactVideoPlayer
                    url={howToApplyData.video_content.video_url}
                    muted={true}
                    controls={true}
                    height="100%"
                    width="100%"
                    playing={isVideoLoaded}
                    playsinline={true}
                />
            )
        ) : (
            <div className={classes.videoThumbnail}>
                <Icon className={classes.videoIcon} src={VideoPlay} />
                <Image
                    key={'how_to_apply'}
                    alt={'How To apply image'}
                    resource={howToApplyData.file}
                    classes={{
                        image: classes.howToApplyImage,
                        root: classes.howToApplyContainer
                    }}
                />
            </div>
        ));

    const howToApplyContent = howToApplyVideo && (
        <section className={classes.howToApply}>
            <div className={classes.applyWrapper}>
                <h5 className={classes.attributeHeader}>
                    <FormattedMessage id={'productFullDetail.howToApply'} defaultMessage={'How to Apply'} />
                </h5>
                <div
                    role="button"
                    tabIndex={0}
                    className={classes.videoWrapper}
                    onClick={handleVideoLoading}
                    onKeyPress={() => undefined}
                >
                    <div className={classes.videoContainer}>{howToApplyVideo}</div>
                </div>
            </div>
        </section>
    );

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={<ProductOptionsShimmer />}>
            <Options onSelectionChange={handleSelectionChange} options={product.configurable_options} />
        </Suspense>
    ) : null;

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // This would be handled elsewhere with an error code and not a string.
        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorToken',
                        defaultMessage:
                            'There was a problem with your cart. Please sign in again and try adding the item once more.'
                    })
                )
            ]);
        }

        // Handle cases where a cart wasn't created properly.
        if (errorMessage.includes('Variable "$cartId" got invalid value null')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorCart',
                        defaultMessage:
                            'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                    })
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorUnknown',
                        defaultMessage: 'Could not add item to cart. Please check required options and try again.'
                    })
                )
            ]);
        }
    }

    const cartCallToActionText = !isOutOfStock ? (
        <FormattedMessage id="productFullDetail.addItemToCart" defaultMessage="Add to bag" />
    ) : (
        <FormattedMessage id="productFullDetail.itemOutOfStock" defaultMessage="Out of Stock" />
    );

    const sizeAttribute = product.product_size_label && (
        <div className={classes.size}>{product.product_size_label}</div>
    );

    const influenceType = product.influence_type_label && (
        <span className={classes.type}>{product.influence_type_label}</span>
    );

    const cartActionContent = isSupportedProductType ? (
        <Button disabled={isAddToCartDisabled} priority="high" type="submit">
            {cartCallToActionText}
        </Button>
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'productFullDetail.unavailableProduct'}
                    defaultMessage={'This product is currently unavailable for purchase.'}
                />
            </p>
        </div>
    );

    const contextValue = {
        isProductPage: true
    };

    const feelGoodIngredients = product.ingredients_you_can_feel_good_about !== 0 && (
        <CmsBlock
            identifiers="ingredients_you_can_feel_good_about"
            classes={{ root: classes.feelGoodIngredientsBlock }}
        />
    );

    const freeGiftMessageBlock = (
        <CmsBlock identifiers="free_gift_message_banner" classes={{ root: classes.freeGiftMessage }} />
    );

    return (
        <AmProductLabelProvider products={product} mode="PRODUCT">
            <Fragment>
                <Modal title={productDetails.name} setShowModal={setShowModal} showModal={showModal}>
                    <Carousel
                        popup
                        classes={{ root: classes.modalCarouselRoot, thumbnailList: classes.modalCarouselThumbnailList }}
                        images={mediaGalleryEntries}
                        currentSlide={activeItemIndex}
                    />
                </Modal>

                <Form className={classes.root} onSubmit={handleAddToCart}>
                    <section className={classes.wrapper}>
                        <section className={classes.imageCarousel}>
                            <Carousel
                                imageRef={imageRef}
                                lensRef={lensRef}
                                moveLens={moveLens}
                                lensSize="200px"
                                setZooming={setZooming}
                                zooming={zooming}
                                zoom
                                onClick={() => setShowModal(!showModal)}
                                images={mediaGalleryEntries}
                                setActiveItemIndex={setActiveItemIndex}
                            />
                        </section>

                        <section className={classes.rightSide}>
                            <div className={zooming ? classes.zooming : classes.notZooming}>
                                <ResultZoom resultSize="575px" zooming resultRef={resultRef} />
                            </div>
                            <h1 className={classes.productName}>
                                {influenceType}
                                {productDetails.name}
                            </h1>
                            <div className={afterTitleClass}>
                                <div className={classes.priceWrapper}>
                                    {sizeAttribute}
                                    <div className={classes.price}>
                                        <Price
                                            currencyCode={productDetails.price.currency}
                                            oldValue={product.price_range.maximum_price.regular_price.value}
                                            value={product.price_range.maximum_price.final_price.value}
                                        />
                                    </div>
                                </div>
                                <div className={classes.reviewWrapper}>
                                    <YotpoStars product={product} />
                                    <a href="#yotpo-reviews" className={classes.reviewLink}>
                                        <FormattedMessage
                                            id={'productFullDetail.readReviews'}
                                            defaultMessage={'Read reviews'}
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className={classes.tabby}>
                                <TabbyPromo
                                    price={product.price_range.maximum_price.final_price.value}
                                    currency={productDetails.price.currency}
                                    source="product"
                                />
                            </div>
                            <CityCarriers />
                            <RichContent
                                classes={{ root: classes.shortDescription }}
                                html={product.short_description.html}
                            />
                            <FormError
                                classes={{
                                    root: classes.formErrors
                                }}
                                errors={errors.get('form') || []}
                            />
                            <div className={classes.options}>{options}</div>
                            <div
                                className={
                                    isProductConfigurable(product)
                                        ? classes.configurableActionContainer
                                        : classes.actionContainer
                                }
                            >
                                <div className={classes.quantity}>
                                    <QuantityFields
                                        min={1}
                                        max={maxQty}
                                        message={errors.get('quantity')}
                                        field="quantity"
                                        sticky={true}
                                        classes={{
                                            root: classes.quantityRoot,
                                            button_decrement: classes.buttonDecrement,
                                            button_increment: classes.buttonIncrement
                                        }}
                                    />
                                </div>
                                <div className={classes.actions}>{cartActionContent}</div>
                                {freeGiftMessageBlock}
                            </div>
                            <ProductAccordion
                                data={[
                                    {
                                        title: formatMessage({
                                            id: 'productAccordion.description',
                                            defaultMessage: 'What it is'
                                        }),
                                        content: product.description ? product.description : undefined
                                    },
                                    {
                                        title: formatMessage({
                                            id: 'productAccordion.benefits',
                                            defaultMessage: 'Benefits'
                                        }),
                                        content: product.benefits ? product.benefits : undefined
                                    },
                                    {
                                        title: formatMessage({
                                            id: 'productAccordion.what_its_for',
                                            defaultMessage: 'Why it works'
                                        }),
                                        content: product.what_its_for ? product.what_its_for : undefined
                                    },
                                    {
                                        title: formatMessage({
                                            id: 'productAccordion.how_to_use',
                                            defaultMessage: 'How to use'
                                        }),
                                        content: product.how_to_use ? product.how_to_use : undefined
                                    },
                                    {
                                        title: formatMessage({
                                            id: 'productAccordion.clinical_results',
                                            defaultMessage: 'Clinical Results'
                                        }),
                                        content: product.clinical_results ? product.clinical_results : undefined
                                    }
                                ]}
                            />
                        </section>
                    </section>
                    {howToApplyContent}
                    <IngredientsBlock ingredients={product.ingredients} ingredientContent={product.all_ingredients} />
                    <section className={classes.feelGoodIngredients}>{feelGoodIngredients}</section>
                    <ProductFAQ image={product.faq_image} data={product.product_faq} />
                    <Provider value={contextValue}>
                        <CmsBlock
                            identifiers={CMS_BLOCK_ID_YOTPO}
                            classes={{
                                root: classes.yotpo,
                                block: null,
                                content: null
                            }}
                        />
                    </Provider>
                    <StickyBlock
                        product={product}
                        influenceType={product.influence_type_label}
                        sizeAttribute={sizeAttribute}
                        errors={errors}
                        cartActionContent={cartActionContent}
                        currencyCode={productDetails.price.currency}
                        selectedOptionLabels={selectedOptionLabels}
                        max={maxQty}
                    />
                </Form>
                <YotpoReviews product={product} />
                <ListingProducts
                    items={product.related_products}
                    title={formatMessage({
                        id: 'listingProducts.youMayAlsoLike',
                        defaultMessage: 'You may also like...'
                    })}
                />
                {product && <ProductRichSnippet product={product} />}
            </Fragment>
        </AmProductLabelProvider>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        descriptionTitle: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        root: string,
        title: string,
        unavailableContainer: string,
        reviewWrapper: string,
        reviewLink: string
    }),
    product: shape({
        __typename: string,
        id: number,
        stock_status: string,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        description: string,
        yotpo_product_tag_label: string,
        meta_description: string
    }).isRequired
};

export default ProductFullDetail;

export const useProductContext = () => useContext(ProductContext);
