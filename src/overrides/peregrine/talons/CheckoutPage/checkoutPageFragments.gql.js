import { gql } from '@apollo/client';

import { ProductListingFragment } from '@magento/peregrine/lib/talons/CartPage/ProductListing/productListingFragments.gql';

export const CheckoutPageFragment = gql`
    fragment CheckoutPageFragment on Cart {
        id
        # If total quantity is falsy we render empty.
        total_quantity
        available_payment_methods {
            code
        }
        ...ProductListingFragment
    }
    ${ProductListingFragment}
`;
