import { gql } from '@apollo/client';

export const GET_RELATED_PRODUCTS = gql`
    query amBlogPostRelatedProducts($postId: Int!) {
        amBlogPostRelatedProducts(postId: $postId) {
            items {
                id
                name
                sku
                image {
                    disabled
                    url
                    label
                }
                small_image {
                    disabled
                    url
                    label
                }
                thumbnail {
                    disabled
                    url
                    label
                }
                swatch_image_configurable
                price_range {
                    minimum_price {
                        final_price {
                            value
                            currency
                        }
                        final_price {
                            value
                            currency
                        }
                        regular_price {
                            currency
                            value
                        }
                    }
                    maximum_price {
                        final_price {
                            value
                            currency
                        }
                        final_price {
                            value
                            currency
                        }
                        regular_price {
                            currency
                            value
                        }
                    }
                }
                is_salable
                rating_summary
                reviews_count
                url_key
                url_suffix
                url_path
                url_rewrites {
                    url
                }
                special_price
                special_from_date
                special_to_date
                attribute_set_id
                type_id
                manufacturer
                categories {
                    url_path
                    url_key
                    level
                    name
                }
                canonical_url
                swatch_image {
                    url
                    label
                }
                stock_status
                influence_type_label
                category_name_in_tile
                max_qty
            }
        }
    }
`;
