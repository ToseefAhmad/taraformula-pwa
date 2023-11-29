import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';

import { GET_SEARCH_INGREDIENTS } from '@app/components/Ingredients/ingredients.gql';

export const useDiscoverIngredients = ({ currentIngredientName }) => {
    let removedItemIndex = 0;

    const [runSearchQuery, { called, loading, error, data }] = useLazyQuery(GET_SEARCH_INGREDIENTS);

    const { productIngredients } = called && !loading && !error && data;

    const sortedArray =
        productIngredients &&
        productIngredients.items.length !== 0 &&
        [...productIngredients.items]
            .sort((a, b) => a.ingredient.name.toLowerCase().localeCompare(b.ingredient.name.toLowerCase()))
            .filter((item, index) => {
                if (item.ingredient.name.toLowerCase() === currentIngredientName.toLowerCase()) {
                    removedItemIndex = index;
                }
                return item.ingredient.name.toLowerCase() !== currentIngredientName.toLowerCase();
            });

    useEffect(() => {
        runSearchQuery({
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            variables: {
                letter: '',
                category: null
            }
        });
    }, [runSearchQuery]);

    return {
        loading,
        sortedArray,
        removedItemIndex
    };
};
