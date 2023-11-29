import { gql } from '@apollo/client';

import { ProductDetailsFragment } from './productDetailFragment.gql';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        storeConfig {
            id
            product_url_suffix
        }
    }
`;

export const GET_PRODUCT_DETAIL_QUERY = gql`
    query getProductDetailForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                id
                uid
                product_main_image
                ...ProductDetailsFragment
            }
        }
    }
    ${ProductDetailsFragment}
`;

export const GET_CART_ITEMS_FOR_PRODUCT_PAGE = gql`
    query GetCartItemsForProductPage($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            items {
                id
                product {
                    id
                    sku
                }
                quantity
            }
        }
    }
`;

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getProductDetailQuery: GET_PRODUCT_DETAIL_QUERY,
    getCartItemsForProductPage: GET_CART_ITEMS_FOR_PRODUCT_PAGE
};
