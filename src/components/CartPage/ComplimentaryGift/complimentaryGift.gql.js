import { gql } from '@apollo/client';

import { DiscountSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/discountSummary.gql';

export const GET_COMPLIMENTARY_GIFT_DATA = gql`
    query GetComplimentaryGiftData($cartId: String!) {
        getComplimentaryGiftData(cartId: $cartId) {
            discountStep
            isRuleActive
            ruleId
            complimentaryGiftProducts {
                id
                uid
                name
                max_qty
                small_image {
                    url
                }
                swatch_image
                stock_status
                type_id
                url_key
                url_suffix
                sku
                price_range {
                    maximum_price {
                        regular_price {
                            value
                            currency
                        }
                        final_price {
                            value
                            currency
                        }
                    }
                }
                influence_type_label
                categories {
                    name
                    id
                }
                category_name_in_tile
                image {
                    url
                    label
                }
            }
            selectedComplimentaryGiftItems
        }
    }
`;

export const ADD_COMPLIMENTARY_GIFT = gql`
    mutation AddComplimentaryGift($cartId: String!, $item: AddComplimentaryGiftItemInput!) {
        addComplimentaryGift(cartId: $cartId, item: $item) {
            success
            cart {
                id
                prices {
                    ...DiscountSummaryFragment
                }
            }
        }
    }
    ${DiscountSummaryFragment}
`;

export const REMOVE_COMPLIMENTARY_GIFT = gql`
    mutation RemoveComplimentaryGift($cartId: String!) {
        removeComplimentaryGift(cartId: $cartId) {
            success
            cart {
                id
                prices {
                    ...DiscountSummaryFragment
                }
            }
        }
    }
    ${DiscountSummaryFragment}
`;
