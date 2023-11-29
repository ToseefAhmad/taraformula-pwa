import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';

import { GET_PRODUCT_INGREDIENTS } from '@app/components/Ingredients/ingredients.gql';

export const useIngredients = ingredients => {
    const [runQuery, { loading, error, data }] = useLazyQuery(GET_PRODUCT_INGREDIENTS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    useEffect(() => {
        if (ingredients) {
            const ids = ingredients.split(',').map(Number);

            runQuery({
                variables: {
                    entityIds: ids
                }
            });
        }
    }, [runQuery, ingredients]);

    return {
        loading,
        error,
        data: data ? data.productIngredientsById.items : []
    };
};
