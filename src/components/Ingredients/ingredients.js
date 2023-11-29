import React, { lazy, useMemo } from 'react';
import { useParams } from 'react-router-dom';

const IngredientsCatalogPage = lazy(() => import('./IngredientsCatalogPage'));
const IngredientDetailPage = lazy(() => import('./IngredientDetailPage'));

const Ingredients = () => {
    const { slug } = useParams();

    const Page = useMemo(() => {
        if (!slug) {
            return IngredientsCatalogPage;
        }

        return IngredientDetailPage;
    }, [slug]);

    return <Page />;
};

export default Ingredients;
