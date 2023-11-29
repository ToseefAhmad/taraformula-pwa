import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Hreflangs from '@app/components/Hreflangs';
import DiscoverIngredients from '@app/components/Ingredients/DiscoverIngredients';
import CmsBlockShimmer from '@app/components/Ingredients/IngredientDetailPage/cmsBlock.shimmer';
import IngredientDetailPageShimmer from '@app/components/Ingredients/IngredientDetailPage/ingredientDetailPage.shimmer';
import ProductsCarousel from '@app/components/Ingredients/IngredientProductSuggestionCarousel';
import { carouselSettings } from '@app/components/Ingredients/IngredientProductSuggestionCarousel/carouselSettings';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { Meta, StoreTitle, Link } from '@magento/venia-ui/lib/components/Head';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import classes from './ingredientDetailPage.module.css';
import { useIngredientDetailPage } from './useIngredientDetailPage';

const IngredientDetailPage = () => {
    const [blocks, setBlocks] = useState(new Map());
    const { productIngredientByUrlKey, loading, error, cmsLoading, cmsError, cmsData } = useIngredientDetailPage();
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();
    const { ingredientCmsBlocks } = !cmsError && !cmsLoading && cmsData;

    useEffect(() => {
        setPageLoading(!productIngredientByUrlKey);
    }, [productIngredientByUrlKey, setPageLoading]);

    useEffect(() => {
        if (ingredientCmsBlocks) {
            const blocksTemp = new Map();
            ingredientCmsBlocks.blocks.map(v => blocksTemp.set(v.location, v.identifier));
            setBlocks(blocksTemp);
        }
    }, [ingredientCmsBlocks]);

    if (error) {
        return <ErrorView />;
    }

    const bottomBlock =
        !cmsError && !cmsLoading && blocks.size !== 0 && blocks.get('bottom_detail') ? (
            <CmsBlock
                identifiers={blocks.get('bottom_detail')}
                classes={{
                    block: null,
                    content: null,
                    root: classes.bottomBlock
                }}
            />
        ) : (
            <CmsBlockShimmer />
        );

    const IngredientPage = !loading && productIngredientByUrlKey && productIngredientByUrlKey.ingredient && (
        <div className={classes.ingredientDescription}>
            <RichContent html={productIngredientByUrlKey.ingredient.description} />
        </div>
    );

    const metaData = productIngredientByUrlKey && productIngredientByUrlKey.ingredient && (
        <>
            <StoreTitle>
                {productIngredientByUrlKey.ingredient.meta_title || productIngredientByUrlKey.ingredient.name}
            </StoreTitle>
            <Meta name="title" content={productIngredientByUrlKey.ingredient.meta_title} />
            <Meta
                name="description"
                content={
                    productIngredientByUrlKey.ingredient.meta_description ||
                    productIngredientByUrlKey.ingredient.short_description
                }
            />
            <Meta name="keywords" content={productIngredientByUrlKey.ingredient.meta_keywords} />
            <Hreflangs
                hreflangs={
                    (productIngredientByUrlKey &&
                        productIngredientByUrlKey.ingredient &&
                        productIngredientByUrlKey.ingredient.hreflangs) ||
                    []
                }
            />
        </>
    );
    const relatedProducts = !loading &&
        productIngredientByUrlKey &&
        productIngredientByUrlKey.products &&
        !!productIngredientByUrlKey.products.length && (
            <div className={classes.relatedProducts}>
                <p className={classes.relatedProductsTitle}>
                    <FormattedMessage id={'ingredientPage.canBeFound'} defaultMessage={'Can be found in:'} />
                </p>
                <ProductsCarousel
                    settings={carouselSettings}
                    items={productIngredientByUrlKey.products}
                    type="product"
                />
            </div>
        );

    const discoverProducts = productIngredientByUrlKey && productIngredientByUrlKey.ingredient && (
        <div className={classes.discoverProducts}>
            <p className={classes.relatedProductsTitle}>
                <FormattedMessage
                    id={'ingredientPage.discoverMoreIngredient'}
                    defaultMessage={'Discover more ingredients:'}
                />
            </p>
            <DiscoverIngredients currentIngredientName={productIngredientByUrlKey.ingredient.name} />
        </div>
    );

    const canonicalLink = productIngredientByUrlKey && productIngredientByUrlKey.ingredient && (
        <Link rel="canonical" href={productIngredientByUrlKey.ingredient.canonical_full_url} />
    );

    return (
        <div>
            {metaData}
            {canonicalLink}
            <div className={classes.ingredientContentWrapper}>
                <div className={classes.ingredientContent}>
                    {!loading ? (
                        <>
                            {IngredientPage}
                            <div className={classes.suggestionBlock}>
                                {relatedProducts}
                                {discoverProducts}
                            </div>
                        </>
                    ) : (
                        <IngredientDetailPageShimmer />
                    )}
                </div>
            </div>
            <div className={classes.bottomCmsBlock}>{bottomBlock}</div>
        </div>
    );
};

export default IngredientDetailPage;
