import { useLazyQuery, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { GET_INGREDIENT_BY_URL_KEY, GET_INGREDIENTS_CMS_BLOCKS } from '@app/components/Ingredients/ingredients.gql';

export const useIngredientDetailPage = () => {
    const { slug } = useParams();
    const [runQuery, { called, loading, error, data }] = useLazyQuery(GET_INGREDIENT_BY_URL_KEY, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { data: cmsData, loading: cmsLoading, error: cmsError } = useQuery(GET_INGREDIENTS_CMS_BLOCKS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    useEffect(() => {
        runQuery({
            variables: {
                urlKey: slug
            }
        });
    }, [runQuery, slug]);

    const { productIngredientByUrlKey } = called && !loading && !error && data;

    return {
        productIngredientByUrlKey,
        loading,
        error,
        cmsLoading,
        cmsError,
        cmsData
    };
};
