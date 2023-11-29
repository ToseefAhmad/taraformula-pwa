import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';

import { GET_PRODUCT_INGREDIENT } from '@app/components/Ingredients/ingredients.gql';

export const useIngredient = id => {
    const [runQuery, { loading, error, data }] = useLazyQuery(GET_PRODUCT_INGREDIENT, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    useEffect(() => {
        runQuery({
            variables: {
                entityId: id
            }
        });
    }, [runQuery, id]);

    return {
        loading,
        error,
        data
    };
};
