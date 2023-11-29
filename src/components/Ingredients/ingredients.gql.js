import { gql } from '@apollo/client';

export const GET_INGREDIENTS_CMS_BLOCKS = gql`
    {
        ingredientCmsBlocks {
            blocks {
                identifier
                location
            }
        }
    }
`;

// Returns alphabet and items count in each letter
export const GET_INGREDIENTS_ALPHABET = gql`
    query GetProductIngredientsAlphabet($category: String) {
        productIngredientsAlphabet(category: $category) {
            items {
                letter
                count
            }
        }
    }
`;

// Returns all ingredients categories, no matter which letter is selected
export const GET_INGREDIENTS_CATEGORIES = gql`
    {
        productIngredientCategories {
            items {
                name
            }
        }
    }
`;

// Returns search results
export const GET_SEARCH_INGREDIENTS = gql`
    query GetProductIngredients($letter: String, $category: String) {
        productIngredients(letter: $letter, category: $category) {
            items {
                ingredient {
                    name
                    category
                    source
                    contains
                    known
                    image
                    url_key
                }

                products {
                    name
                    url_key
                    influence_type_label
                }
            }
        }
    }
`;

export const GET_INGREDIENT_BY_URL_KEY = gql`
    query GetProductIngredientByUrlKey($urlKey: String) {
        productIngredientByUrlKey(urlKey: $urlKey) {
            ingredient {
                entity_id
                name
                category
                image
                source
                contains
                known
                short_description
                description
                url_key
                meta_title
                meta_keywords
                meta_description
                created_at
                canonical_full_url
                hreflangs {
                    url
                    lang
                }
            }
            products {
                name
                image
                small_image
                swatch_image
                swatch_image_configurable
                url_key
                influence_type_label
            }
        }
    }
`;

// Returns ingredient data by ID
export const GET_PRODUCT_INGREDIENT = gql`
    query GetProductIngredient($entityId: Int) {
        productIngredient(entityId: $entityId) {
            entity_id
            name
            image
            short_description
            url_key
        }
    }
`;

// Returns ingredient list by IDs
export const GET_PRODUCT_INGREDIENTS = gql`
    query GetProductIngredients($entityIds: [Int]) {
        productIngredientsById(entityIds: $entityIds) {
            items {
                entity_id
                name
                image
                short_description
                url_key
            }
        }
    }
`;

export const GET_INGREDIENT_CATALOG_PAGE_META_DATA = gql`
    {
        ingredientPageSeoData {
            meta_title
            meta_keywords
            meta_description
            canonical_full_url
            hreflangs {
                url
                lang
            }
        }
    }
`;
