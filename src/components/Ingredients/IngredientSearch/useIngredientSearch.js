import { useLazyQuery, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import {
    GET_INGREDIENTS_ALPHABET,
    GET_INGREDIENTS_CATEGORIES,
    GET_SEARCH_INGREDIENTS
} from '@app/components/Ingredients/ingredients.gql';

export const useIngredientSearch = ({ letter }) => {
    const [queryItems, setQueryItems] = useState({
        letter: letter,
        category: null
    });

    // Load all categories
    const { loading: categoryLoading, error: categoryError, data: categoryData } = useQuery(
        GET_INGREDIENTS_CATEGORIES,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    // Load alphabet
    const [
        runAlphabetQuery,
        { called: alphabetCalled, loading: alphabetLoading, error: alphabetError, data: alphabetData }
    ] = useLazyQuery(GET_INGREDIENTS_ALPHABET);

    // Load ingredients
    const [
        runSearchQuery,
        { called: searchCalled, loading: searchLoading, error: searchError, data: searchData }
    ] = useLazyQuery(GET_SEARCH_INGREDIENTS);

    const { productIngredientsAlphabet } = alphabetCalled && !alphabetLoading && !alphabetError && alphabetData;
    const { productIngredients } = searchCalled && !searchLoading && !searchError && searchData;
    const { productIngredientCategories } = !categoryLoading && !categoryError && categoryData;

    useEffect(() => {
        runAlphabetQuery({
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            variables: {
                category: queryItems.category
            }
        });

        runSearchQuery({
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            variables: { ...queryItems }
        });
    }, [runAlphabetQuery, runSearchQuery, queryItems]);

    // On letter click
    const handleLetter = letter => {
        if (queryItems.letter === letter) {
            letter = '';
        }

        setQueryItems({ ...queryItems, letter: letter });
    };

    // On category click
    const handleCategory = category => {
        setQueryItems({ category: category, letter: '' });
    };

    return {
        handleLetter,
        handleCategory,
        productIngredients,
        productIngredientsAlphabet,
        productIngredientCategories,
        queryItems
    };
};
