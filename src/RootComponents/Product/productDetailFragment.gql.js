import { gql } from '@apollo/client';

export const ProductDetailsFragment = gql`
    fragment ProductDetailsFragment on ProductInterface {
        __typename
        categories {
            id
            uid
            include_in_menu
            name
            position
            url_path
            breadcrumbs {
                category_id
            }
        }
        description {
            html
        }
        id
        uid
        media_gallery_entries {
            # id is deprecated and unused in our code, but lint rules require we
            # request it if available
            id
            uid
            label
            position
            disabled
            file
            types
            media_type
            video_content {
                media_type
                video_description
                video_metadata
                video_provider
                video_title
                video_url
            }
        }
        related_products {
            id
            uid
            name
            small_image {
                url
            }
            swatch_image
            swatch_image_configurable
            category_name_in_tile
            stock_status
            type_id
            url_key
            url_suffix
            sku
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
            influence_type_label
            categories {
                id
                name
                url_path
                is_active
            }
            max_qty
        }
        meta_description
        name
        price {
            regularPrice {
                amount {
                    currency
                    value
                }
            }
        }
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
        faq_image
        how_to_apply_video
        ingredients
        ingredients_you_can_feel_good_about
        all_ingredients
        small_image {
            url
        }
        swatch_image
        swatch_image_configurable
        stock_status
        max_qty
        influence_type_label
        short_description {
            html
        }
        tag_line
        benefits
        what_its_for
        how_to_use
        clinical_results
        url_key
        ... on ConfigurableProduct {
            configurable_options {
                attribute_code
                attribute_id
                id
                label
                use_default
                values {
                    uid
                    default_label
                    label
                    store_label
                    use_default_value
                    value_index
                    swatch_data {
                        ... on ImageSwatchData {
                            thumbnail
                        }
                        value
                    }
                }
            }
            variants {
                attributes {
                    code
                    value_index
                }
                product {
                    id
                    uid
                    media_gallery_entries {
                        # id is deprecated and unused in our code, but lint rules require we
                        # request it if available
                        id
                        uid
                        label
                        position
                        disabled
                        file
                        types
                        media_type
                        video_content {
                            media_type
                            video_description
                            video_metadata
                            video_provider
                            video_title
                            video_url
                        }
                    }
                    sku
                    stock_status
                    max_qty
                    price {
                        regularPrice {
                            amount {
                                currency
                                value
                            }
                        }
                    }
                }
            }
        }
        product_faq
        product_size_label
        rating_summary
        review_count
        reviews {
            items {
                nickname
                average_rating
                text
            }
        }
        yotpo_product_tag_label
        hreflangs {
            url
            lang
        }
        canonical_full_url
        description_string
    }
`;
