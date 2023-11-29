import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        storeConfig {
            id
            code
            store_name
            store_group_name
            store_group_code
        }
    }
`;

export const GET_URL_RESOLVER_DATA = gql`
    query getUrlResolverData($url: String!) {
        urlResolver(url: $url) {
            id
            type
        }
    }
`;

export const GET_AVAILABLE_STORES_DATA = gql`
    query getAvailableStoresData {
        availableStores(queryAllWebsites: true) {
            category_url_suffix
            code
            default_display_currency_code
            id
            locale
            product_url_suffix
            secure_base_url
            secure_base_media_url
            store_group_code
            store_group_name
            store_name
            store_sort_order
        }
    }
`;

export const CREATE_ONE_TIME_TOKEN = gql`
    mutation createOneTimeToken($value: String!) {
        createOneTimeToken(value: $value)
    }
`;

export const GET_CART_TOTAL_QTY = gql`
    query GetCartTotalQty($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            total_quantity
        }
    }
`;
