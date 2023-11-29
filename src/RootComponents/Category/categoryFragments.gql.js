import { gql } from '@apollo/client';

export const CategoryFragment = gql`
    fragment CategoryFragment on CategoryTree {
        id
        meta_title
        meta_keywords
        meta_description
        url_path
        canonical_full_url
        hreflangs {
            url
            lang
        }
    }
`;

export const ProductsFragment = gql`
    fragment ProductsFragment on Products {
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
            max_qty
            swatch_image
            swatch_image_configurable
            influence_type_label
            stock_status
            type_id
            url_key
        }
        page_info {
            total_pages
        }
        total_count
    }
`;
