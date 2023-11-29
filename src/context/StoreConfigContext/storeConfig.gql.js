import { gql } from '@apollo/client';

const ProductGetStoreConfigDataFragment = gql`
    fragment ProductGetStoreConfigDataFragment on StoreConfig {
        product_url_suffix
    }
`;

const AmastySocialLoginGetStoreConfigDataFragment = gql`
    fragment AmastySocialLoginGetStoreConfigDataFragment on StoreConfig {
        amsociallogin_general_enabled
        amsociallogin_general_login_position
        amsociallogin_general_button_shape
        amsociallogin_general_popup_enabled
        amsociallogin_general_button_position
        amsociallogin_general_redirect_type
        amsociallogin_general_custom_url
    }
`;

const YotpoGetStoreConfigDataFragment = gql`
    fragment YotpoGetStoreConfigDataFragment on StoreConfig {
        yotpo_api_key
        yotpo_token
    }
`;

const CategoryGetStoreConfigDataFragment = gql`
    fragment CategoryGetStoreConfigDataFragment on StoreConfig {
        category_url_suffix
        root_category_id
    }
`;

const LocaleGetStoreConfigDataFragment = gql`
    fragment LocaleGetStoreConfigDataFragment on StoreConfig {
        locale
    }
`;

const StoresGetStoreConfigDataFragment = gql`
    fragment StoresGetStoreConfigDataFragment on StoreConfig {
        id
        code
        store_name
        store_group_name
        store_group_code
        category_url_suffix
        default_display_currency_code
        locale
        product_url_suffix
        secure_base_url
        secure_base_media_url
        store_sort_order
        shipping_from_label_general_ship_from_label
        shipping_from_label_general_enable
    }
`;

const TabbyGetStoreConfigDataFragment = gql`
    fragment TabbyGetStoreConfigDataFragment on StoreConfig {
        tabby_public_key
        tabby_installments_enabled
    }
`;

const GetCaptchaConfigDataFragment = gql`
    fragment GetCaptchaConfigDataFragment on StoreConfig {
        captcha_key
        captcha_language
    }
`;

const GetGeolocationConfigDataFragment = gql`
    fragment GetGeolocationConfigDataFragment on StoreConfig {
        geolocation_enabled
        geolocation_gps_lifetime
    }
`;

const FreeShippingConfigDataFragment = gql`
    fragment FreeShippingConfigDataFragment on StoreConfig {
        free_shipping_enabled
        free_shipping_tax_including
        free_shipping_threshold
    }
`;

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        storeConfig {
            id
            ...ProductGetStoreConfigDataFragment
            ...AmastySocialLoginGetStoreConfigDataFragment
            ...YotpoGetStoreConfigDataFragment
            ...CategoryGetStoreConfigDataFragment
            ...LocaleGetStoreConfigDataFragment
            ...StoresGetStoreConfigDataFragment
            ...TabbyGetStoreConfigDataFragment
            ...GetCaptchaConfigDataFragment
            ...GetGeolocationConfigDataFragment
            ...FreeShippingConfigDataFragment
        }
    }
    ${ProductGetStoreConfigDataFragment}
    ${AmastySocialLoginGetStoreConfigDataFragment}
    ${YotpoGetStoreConfigDataFragment}
    ${CategoryGetStoreConfigDataFragment}
    ${LocaleGetStoreConfigDataFragment}
    ${StoresGetStoreConfigDataFragment}
    ${TabbyGetStoreConfigDataFragment}
    ${GetCaptchaConfigDataFragment}
    ${GetGeolocationConfigDataFragment}
    ${FreeShippingConfigDataFragment}
`;
