import { gql } from '@apollo/client';

export const GET_AUTOCOMPLETE_RESULTS = gql`
    query getAutocompleteResults($inputText: String!) {
        # Limit results to first three.
        products(search: $inputText, currentPage: 1, pageSize: 6) {
            aggregations {
                label
                count
                attribute_code
                options {
                    label
                    value
                    url
                }
            }
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
                influence_type_label
                stock_status
                type_id
                url_key
                max_qty
            }
            page_info {
                total_pages
            }
            total_count
        }
    }
`;
