import { gql } from '@apollo/client';

export const GET_PRODUCTS_BY_SKU = gql`
    query getProductsBySku($skus: [String], $pageSize: Int!) {
        products(filter: { sku: { in: $skus } }, pageSize: $pageSize) {
            items {
                id
                uid
                name
                price_range {
                    maximum_price {
                        regular_price {
                            currency
                            value
                        }
                        final_price {
                            value
                            currency
                        }
                    }
                }
                sku
                small_image {
                    url
                }
                swatch_image
                swatch_image_configurable
                stock_status
                type_id
                url_key
                influence_type_label
                categories {
                    name
                    url_path
                }
                max_qty
            }
            total_count
        }
    }
`;
