import { gql } from '@apollo/client';

export const ItemsReviewFragment = gql`
    fragment ItemsReviewFragment on Cart {
        id
        total_quantity
        items {
            id
            isFreeGift
            prices {
                price {
                    value
                    currency
                }
                total_item_discount {
                    value
                    currency
                }
                row_total_including_tax {
                    value
                    currency
                }
            }
            product {
                id
                sku
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
                influence_type_label
                url_key
                small_image {
                    url
                }
                swatch_image
                swatch_image_configurable
                thumbnail {
                    url
                }
                small_image {
                    url
                }
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                        }
                        product {
                            id
                            small_image {
                                url
                            }
                        }
                    }
                }
                swatch_image_configurable
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                        }
                        product {
                            id
                            small_image {
                                url
                            }
                        }
                    }
                }
            }
            quantity
            ... on ConfigurableCartItem {
                configurable_options {
                    id
                    option_label
                    value_id
                    value_label
                }
            }
        }
    }
`;
