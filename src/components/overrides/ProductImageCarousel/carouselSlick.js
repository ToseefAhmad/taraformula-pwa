import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import ReactVideoPlayer from 'react-player/lazy';
import Slider from 'react-slick';

import { VideoPlay } from '@app/components/Icons';
import Image from '@app/components/ImageZoom';
import AmProductLabels from '@app/components/ProductLabels/productLabels';
import { getDirection, Directions } from '@app/hooks/useDirection';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useProduct } from '@app/RootComponents/Product/useProduct';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import { useProductImageCarousel } from '@magento/peregrine/lib/talons/ProductImageCarousel/useProductImageCarousel';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import mapProduct from '@magento/venia-ui/lib/util/mapProduct';

import defaultClasses from './carousel.module.css';
import Thumbnail from './thumbnail';

// Import css files
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 320;
const IMAGE_RATIO = 1;

/**
 * Carousel component for product images
 * Carousel - Component that holds number of images
 * where typically one image visible, and other
 * images can be navigated through previous and next buttons
 *
 * @typedef ProductImageCarouselSlick
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns {React.Element} React carousel component that displays a product image
 */
const ProductImageCarouselSlick = ({ images, popup, setActiveItemIndex, currentSlide, ...rest }) => {
    const { product } = useProduct({
        mapProduct
    });

    const productAltText = product && `${product.influence_type_label} ${product.name}`;
    const { isDesktopScreen } = useScreenSize();
    const IMAGE_WIDTHS = new Map()
        .set(480, 320)
        .set(800, 640)
        .set(1024, 960)
        .set(UNCONSTRAINED_SIZE_KEY, IMAGE_WIDTH);

    const classes = useStyle(defaultClasses, rest.classes);

    const isRtlDirection = getDirection() === Directions.rtl;

    const [playingVideo, setPlayingVideo] = useState(true);

    const talonProps = useProductImageCarousel({
        images,
        imageWidth: IMAGE_WIDTH
    });

    const { currentImage, activeItemIndex, altText, handleThumbnailClick, sortedImages } = talonProps;

    // Create thumbnail image component for every images in sorted order
    const thumbnails = useMemo(
        () =>
            sortedImages
                .filter(item => !item.types.includes('how_to_apply_video') && !item.types.includes('faq_image'))
                .map((item, index) => {
                    return (
                        <Thumbnail
                            id={item.uid}
                            key={item.uid}
                            item={item}
                            itemIndex={index}
                            isActive={activeItemIndex === index}
                            onClickHandler={handleThumbnailClick}
                        />
                    );
                }),
        [activeItemIndex, handleThumbnailClick, sortedImages]
    );

    const slidesToShow = thumbnails.length >= 6 ? 6 : thumbnails.length;
    const slidesToShowTablet = thumbnails.length >= 5 ? 5 : thumbnails.length;

    const noImageContent = key => {
        return (
            <Image
                {...rest}
                key={key + '-' + altText + '-no-image'}
                alt={productAltText + altText + 'no-image'}
                classes={{
                    image: classes.currentImage_placeholder,
                    root: classes.imageContainer
                }}
                src={transparentPlaceholder}
            />
        );
    };

    const notImageSlide = sortedImages[activeItemIndex].media_type !== 'image';

    let productImages;
    if (currentImage.file) {
        productImages = sortedImages.map(
            (item, index) =>
                !item.types.includes('how_to_apply_video') &&
                !item.types.includes('faq_image') &&
                (item.media_type === 'image' ? (
                    <div className={classes.imageLabelContainer}>
                        {index === 0 ? (
                            <AmProductLabels mode="PRODUCT" itemId={product.id} productWidth={IMAGE_WIDTH} />
                        ) : null}
                        <Image
                            {...rest}
                            key={item.id}
                            alt={productAltText || altText}
                            classes={{
                                root: classes.imageContainer
                            }}
                            resource={item.file}
                            widths={IMAGE_WIDTHS}
                            height={IMAGE_HEIGHT}
                            ratio={IMAGE_RATIO}
                            id={item.id}
                            idx={index}
                            notImageSlide={notImageSlide}
                        />
                    </div>
                ) : item.media_type === 'external-video' ? (
                    // Lazy load the player, for vimeo its required to have no controls
                    <div
                        onClick={() => (popup ? setPlayingVideo(prevState => !prevState) : rest.onClick())}
                        role="button"
                        onKeyDown={() => undefined}
                        tabIndex={0}
                    >
                        {popup ? (
                            <div
                                style={{ pointerEvents: popup && playingVideo ? 'all' : 'none' }}
                                className={classes.videoContent}
                                key={item.id}
                            >
                                <ReactVideoPlayer
                                    url={item.video_content.video_url}
                                    width="100%"
                                    height="100%"
                                    controls={false}
                                    playing={popup ? playingVideo : false}
                                    playsinline={true}
                                    onPlay={() => setPlayingVideo(true)}
                                    onPause={() => setPlayingVideo(false)}
                                    muted={true}
                                    config={{
                                        vimeo: {
                                            controls: false
                                        }
                                    }}
                                />
                            </div>
                        ) : (
                            <div className={classes.sliderVideoThumbnail}>
                                <Icon className={classes.sliderVideoIcon} src={VideoPlay} />
                                <Image
                                    key={'slider_video_thumbnail'}
                                    alt={'slider video thumbnail'}
                                    resource={item.file}
                                    classes={{
                                        image: classes.sliderHowToApplyImage,
                                        root: classes.imageContainer
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    noImageContent(item.id)
                ))
        );
    } else {
        productImages = noImageContent('no-img');
    }

    const initialSlide = isRtlDirection && !isDesktopScreen ? productImages.length - 1 : 0;

    const slider = useRef(null);
    const slider2 = useRef(null);

    const [nav1, setNav1] = useState(null);
    const [nav2, setNav2] = useState(null);

    useEffect(() => {
        setNav1(slider.current);
        setNav2(slider2.current);
    }, [slider, slider2]);

    const handleAfterChange = index => {
        if (!popup) {
            setActiveItemIndex(index);
        }
    };

    useEffect(() => {
        if (!popup) {
            setActiveItemIndex(initialSlide);
        }
    }, [initialSlide, popup, setActiveItemIndex]);

    return (
        <div className={classes.root}>
            <div className={[classes.carouselContainer, popup ? classes.popupCarouselContainer : ''].join(' ')}>
                <Slider
                    afterChange={currentSlide => handleAfterChange(currentSlide)}
                    asNavFor={nav2}
                    ref={slider}
                    fade={!popup}
                    dots={false}
                    arrows={true}
                    variableWidth={popup && isRtlDirection}
                    initialSlide={currentSlide !== undefined ? currentSlide : initialSlide}
                    responsive={[
                        {
                            breakpoint: 479, // Xs screen
                            settings: {
                                slidesToShow: 1,
                                touchThreshold: 10,
                                cssEase: 'ease-in-out',
                                touchMove: true,
                                arrows: false,
                                dots: true,
                                variableWidth: true,
                                fade: false,
                                infinite: sortedImages.length > 1,
                                rtl: isRtlDirection
                            }
                        },
                        {
                            breakpoint: 1023, // Lg screen
                            settings: {
                                variableWidth: true,
                                centerMode: !popup,
                                arrows: false,
                                dots: true,
                                fade: false,
                                rtl: isRtlDirection
                            }
                        }
                    ]}
                >
                    {productImages}
                </Slider>
            </div>
            <div className={[classes.thumbnailList, popup ? classes.popupThumbnailList : ''].join(' ')}>
                <Slider
                    afterChange={currentSlide => handleAfterChange(currentSlide)}
                    asNavFor={nav1}
                    ref={slider2}
                    slidesToShow={slidesToShow}
                    initialSlide={currentSlide !== undefined ? currentSlide : initialSlide}
                    swipeToSlide={false}
                    focusOnSelect={true}
                    vertical={!popup}
                    arrows={!popup}
                    variableWidth={popup && isRtlDirection}
                    responsive={[
                        {
                            breakpoint: 1279,
                            settings: {
                                slidesToShow: slidesToShowTablet
                            }
                        }
                    ]}
                >
                    {thumbnails}
                </Slider>
            </div>
        </div>
    );
};

/**
 * Props for {@link ProductImageCarouselSlick}
 */
ProductImageCarouselSlick.propTypes = {
    popup: bool,
    setActiveItemIndex: func,
    currentSlide: number,
    classes: shape({
        currentImage_placeholder: string,
        thumbnailList: string,
        videoContent: string,
        imageContainer: string,
        carouselContainer: string,
        root: string
    }),
    images: arrayOf(
        shape({
            label: string,
            position: number,
            disabled: bool,
            file: string.isRequired,
            uid: string.isRequired
        })
    ).isRequired
};

export default ProductImageCarouselSlick;
