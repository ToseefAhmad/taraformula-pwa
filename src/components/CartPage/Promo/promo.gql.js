import { gql } from '@apollo/client';

export const GET_PROMO_DATA = gql`
    query GetPromoData($cartId: String!) {
        getPromoData(cartId: $cartId) {
            discountStep
            isFreeGift
            isQualified
            ruleId
        }
    }
`;
