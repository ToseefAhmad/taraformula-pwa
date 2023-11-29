import { gql } from '@apollo/client';

import { GiftCardFragment } from '@magento/peregrine/lib/talons/CartPage/GiftCards/giftCardFragments.gql';
import { AppliedCouponsFragment } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/CouponCode/couponCodeFragments.gql';
import { ProductListingFragment } from '@magento/peregrine/lib/talons/CartPage/ProductListing/productListingFragments.gql';

export const CartPageFragment = gql`
    fragment CartPageFragment on Cart {
        id
        total_quantity
        items {
            id
            quantity
            product {
                crosssell_products {
                    sku
                }
            }
        }
        ...AppliedCouponsFragment
        ...GiftCardFragment
        ...ProductListingFragment
    }
    ${AppliedCouponsFragment}
    ${GiftCardFragment}
    ${ProductListingFragment}
`;
