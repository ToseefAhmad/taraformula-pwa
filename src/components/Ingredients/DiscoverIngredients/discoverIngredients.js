import { string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import defaultClasses from '@app/components/Ingredients/DiscoverIngredients/discoverIngredients.module.css';
import { carouselSettings } from '@app/components/Ingredients/DiscoverIngredients/ingredientCarouselSettings';
import { useDiscoverIngredients } from '@app/components/Ingredients/DiscoverIngredients/useDiscoverIngredients';
import shimmerClasses from '@app/components/Ingredients/IngredientDetailPage/ingredientDetailPageShimmer.module.css';
import ProductsCarousel from '@app/components/Ingredients/IngredientProductSuggestionCarousel/carousel';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const DiscoverIngredients = ({ currentIngredientName }) => {
    const classes = useStyle(defaultClasses, shimmerClasses);
    const history = useHistory();

    const { sortedArray, removedItemIndex, loading } = useDiscoverIngredients({ currentIngredientName });

    const redirect = () => {
        history.push({
            pathname: '/ingredients',
            state: { letter: currentIngredientName.charAt(0).toLowerCase() }
        });
    };

    const itemShimmer = (
        <div className={classes.relatedProductsShimmerSlider}>
            <div className={classes.relatedProductsShimmerContainer}>
                <div className={classes.relatedProductsShimmerImageLoaded}>
                    <Shimmer width="100%" height="100%" />
                </div>
                <div className={classes.relatedProductsShimmerProductTitle}>
                    <Shimmer width="100%" height="100%" />
                </div>
            </div>
            <div className={classes.relatedProductsShimmerContainer}>
                <div className={classes.relatedProductsShimmerImageLoaded}>
                    <Shimmer width="100%" height="100%" />
                </div>
                <div className={classes.relatedProductsShimmerProductTitle}>
                    <Shimmer width="100%" height="100%" />
                </div>
            </div>
        </div>
    );

    const settings = { ...carouselSettings, initialSlide: removedItemIndex - 1 };

    const carouser = sortedArray && <ProductsCarousel settings={settings} items={sortedArray} type="ingredient" />;

    const discoverBlock = (
        <div>
            <div className={classes.buttonWrapper}>
                {!sortedArray && loading ? itemShimmer : carouser}
                <Button
                    classes={{ root_primary_outline: classes.buttonDiscover }}
                    onClick={redirect}
                    priority="primary"
                    fill="outline"
                >
                    <FormattedMessage
                        id={'discoverIngredient.exploreIngredientIndex'}
                        defaultMessage={'Explore Ingredient Index'}
                    />
                </Button>
            </div>
        </div>
    );

    return <div>{discoverBlock}</div>;
};

DiscoverIngredients.propTypes = {
    currentIngredientName: string
};

export default DiscoverIngredients;
