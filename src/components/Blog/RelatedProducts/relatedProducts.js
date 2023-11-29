import { useQuery } from '@apollo/client';
import { number, string } from 'prop-types';
import React, { useCallback, useState } from 'react';
import Slider from 'react-slick';

import { GET_RELATED_PRODUCTS } from '@app/components/Blog/queries/getRelatedProducts.ggl.js';
import { useCarousel } from '@magento/pagebuilder/lib/ContentTypes/Products/Carousel/useCarousel';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import { carouselSettings } from './carousel';
import Product from './product';
import classes from './relatedProducts.module.css';

const RelatedProducts = ({ postId, title }) => {
    const { loading, error, data } = useQuery(GET_RELATED_PRODUCTS, {
        variables: {
            postId: postId
        }
    });

    const [dragging, setDragging] = useState(false);
    const handleBeforeChange = useCallback(() => {
        setDragging(true);
    }, [setDragging]);

    const handleAfterChange = useCallback(() => {
        setDragging(false);
    }, [setDragging]);

    const { storeConfig } = useCarousel();

    if (loading) {
        return <Shimmer width={'100%'} height={26} />;
    }

    if (error) {
        return null;
    }

    const { amBlogPostRelatedProducts } = data || {};
    const { items } = amBlogPostRelatedProducts || {};
    const relatedProducts =
        items.map(item => (
            <Product
                style={{ width: '63vw' }}
                key={item.id}
                item={item}
                storeConfig={storeConfig}
                dragging={dragging}
            />
        )) || '';

    const responsive = [
        {
            breakpoint: 1280,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: items.length > 3
            }
        },
        {
            breakpoint: 640,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: items.length > 1
            }
        }
    ];

    const sliderSettings = { ...carouselSettings, infinite: items.length > 2, responsive };

    return (
        <div className={classes.root}>
            {items.length > 0 && <h3 className={classes.header}>{title}</h3>}
            <div className={classes.carousel}>
                <Slider beforeChange={handleBeforeChange} afterChange={handleAfterChange} {...sliderSettings}>
                    {relatedProducts}
                </Slider>
            </div>
        </div>
    );
};

RelatedProducts.propTypes = {
    postId: number,
    title: string
};

export default RelatedProducts;
