import { gql } from '@apollo/client';

import { ItemsReviewFragment } from '@app/overrides/peregrine/talons/CheckoutPage/ItemsReview/itemsReviewFragments.gql';
import { AppliedCouponsFragment } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/CouponCode/couponCodeFragments.gql';
import { DiscountSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/discountSummary.gql';
import { GrandTotalFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql';
import { GiftCardSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/queries/giftCardSummary';
import { TaxSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/taxSummary.gql';

export const OrderConfirmationPageFragment = gql`
    fragment OrderConfirmationPageFragment on Cart {
        id
        email
        total_quantity
        shipping_addresses {
            firstname
            lastname
            street
            city
            region {
                label
            }
            postcode
            country {
                label
                code
            }
            telephone
            area
            block
            neighborhood
            zone
            avenue
            house_building
            floor
            building
            flat
            postal_code
            additional_numbers
            id_number
            selected_shipping_method {
                carrier_title
                method_title
                amount {
                    currency
                    value
                }
            }
        }
        billing_address {
            telephone
        }
        selected_payment_method {
            title
        }
        prices {
            ...TaxSummaryFragment
            ...DiscountSummaryFragment
            ...GrandTotalFragment
            subtotal_excluding_tax {
                currency
                value
            }
        }
        codFee {
            currency
            value
        }
        ...ItemsReviewFragment
        ...GiftCardSummaryFragment
        ...AppliedCouponsFragment
    }
    ${ItemsReviewFragment}
    ${DiscountSummaryFragment}
    ${GrandTotalFragment}
    ${TaxSummaryFragment}
    ${GiftCardSummaryFragment}
    ${AppliedCouponsFragment}
`;
