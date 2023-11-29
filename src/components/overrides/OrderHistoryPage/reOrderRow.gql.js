import { gql } from '@apollo/client';

import { CartPageFragment } from '@app/components/overrides/CartPage/cartPageFragments.gql.js';

export const REORDER_ITEMS = gql`
    mutation ReorderItems($orderNumber: String!) {
        reorderItems(orderNumber: $orderNumber) {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;
