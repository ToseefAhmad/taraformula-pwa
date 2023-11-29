import { useQuery } from '@apollo/client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import CmsBlockAdvanced from '@app/components/CmsBlockAdvanced';
import Hreflangs from '@app/components/Hreflangs';
import {
    GET_INGREDIENTS_CMS_BLOCKS,
    GET_INGREDIENT_CATALOG_PAGE_META_DATA
} from '@app/components/Ingredients/ingredients.gql';
import classes from '@app/components/Ingredients/ingredients.module.css';
import NeverListBlock from '@app/components/Ingredients/IngredientsCmsBlocks/neverListBlock';
import TopBlocksShimmer from '@app/components/Ingredients/IngredientsCmsBlocks/topBlock.shimmer';
import IngredientSearch from '@app/components/Ingredients/IngredientSearch';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import { Meta, StoreTitle, Link } from '@magento/venia-ui/lib/components/Head';

/**
 * Offset from top so content is not
 * under navigation when scrolled down
 */
const topOffset = 60;

const IngredientsCatalogPage = () => {
    const { state } = useLocation();
    const neverList = useRef(null);
    const searchSection = useRef(null);
    const letter = state && state.letter ? state.letter : null;
    const [blocks, setBlocks] = useState(new Map());
    const { data, loading, error } = useQuery(GET_INGREDIENTS_CMS_BLOCKS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { data: seoData, loading: seoLoading, error: seoError } = useQuery(GET_INGREDIENT_CATALOG_PAGE_META_DATA, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const scrollToRef = ref =>
        window.scrollTo({
            top: ref.current.offsetTop - topOffset,
            left: 0,
            behavior: 'smooth'
        });
    const executeScroll = useCallback(refToScroll => scrollToRef(refToScroll), []);

    const { ingredientCmsBlocks } = !error && !loading && data;
    const { ingredientPageSeoData } = !seoError && !seoLoading && seoData;

    const metaData = ingredientPageSeoData && (
        <>
            <Link rel="canonical" href={ingredientPageSeoData.canonical_full_url} />
            <StoreTitle>{ingredientPageSeoData.meta_title}</StoreTitle>
            <Meta name="title" content={ingredientPageSeoData.meta_title} />
            <Meta name="description" content={ingredientPageSeoData.meta_description} />
            <Meta name="keywords" content={ingredientPageSeoData.meta_keywords} />
            <Hreflangs hreflangs={(ingredientPageSeoData && ingredientPageSeoData.hreflangs) || []} />
        </>
    );

    useEffect(() => {
        if (ingredientCmsBlocks) {
            const blocksTemp = new Map();
            ingredientCmsBlocks.blocks.map(v => blocksTemp.set(v.location, v.identifier));
            setBlocks(blocksTemp);
        }
    }, [ingredientCmsBlocks]);

    useEffect(() => {
        if (state && state.letter) {
            executeScroll(searchSection);
        }
    });

    const topBlock = blocks.size !== 0 && blocks.get('top') && (
        <CmsBlockAdvanced
            identifiers={blocks.get('top')}
            classes={{
                block: null,
                content: null,
                root: classes.topBlock
            }}
            shimmer={TopBlocksShimmer}
        />
    );

    const neverListBlock = blocks.size !== 0 && blocks.get('never_list') && (
        <NeverListBlock identifiers={blocks.get('never_list')} />
    );

    const bottomBlock = blocks.size !== 0 && blocks.get('bottom') && (
        <CmsBlock
            identifiers={blocks.get('bottom')}
            classes={{
                block: null,
                content: null,
                root: classes.bottomBlock
            }}
        />
    );

    return (
        <div>
            {metaData}
            {!loading ? topBlock : <TopBlocksShimmer />}
            <div ref={searchSection} id="ingredients-list">
                <IngredientSearch executeScroll={() => executeScroll(neverList)} letter={letter} />
            </div>
            <div className={classes.neverListSection} ref={neverList}>
                {neverListBlock}
            </div>
            {bottomBlock}
        </div>
    );
};

export default IngredientsCatalogPage;
