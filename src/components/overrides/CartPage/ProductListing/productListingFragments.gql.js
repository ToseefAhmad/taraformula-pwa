import { gql } from '@apollo/client';

export const ProductListingFragment = gql`
    fragment ProductListingFragment on Cart {
        id
        items {
            id
            uid
            isFreeGift
            product {
                id
                name
                sku
                url_key
                thumbnail {
                    url
                }
                small_image {
                    url
                }
                swatch_image
                swatch_image_configurable
                influence_type_label
                stock_status
                max_qty
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                        }
                        product {
                            id
                            max_qty
                            uid
                            small_image {
                                url
                            }
                        }
                    }
                }
            }
            prices {
                price {
                    currency
                    value
                }
                row_total_including_tax {
                    currency
                    value
                }
            }
            quantity
            errors {
                code
                message
            }
            ... on ConfigurableCartItem {
                configurable_options {
                    id
                    configurable_product_option_value_uid
                    option_label
                    value_id
                    value_label
                }
                configured_variant {
                    id
                    max_qty
                }
            }
        }
    }
`;
