import { gql } from '@apollo/client/core';

import { PriceSummaryFragment } from '@app/overrides/peregrine/talons/CartPage/PriceSummary/priceSummaryFragments.gql';

const configDataFragment = gql`
    fragment FacebookConfigDataFragment on FacebookConfigData {
        source
        magentoVersion
        pluginVersion
        agentVersion
        pixelID
        eventId
        initCode {
            em
            fn
            ln
            ge
            ph
            ct
            st
            zp
            db
            country
            external_id
            fb_login_id
        }
    }
`;

export const FB_ADD_TO_CART = gql`
    mutation FBAddToCart($productSku: String!) {
        fbAddToCart(productSku: $productSku) {
            config {
                ...FacebookConfigDataFragment
            }
            categories
        }
    }
    ${configDataFragment}
`;

export const FB_PRODUCT_VIEW = gql`
    mutation FBProductView($productSku: String!) {
        fbProductView(productSku: $productSku) {
            ...FacebookConfigDataFragment
        }
    }
    ${configDataFragment}
`;

export const FB_INITIATE_CHECKOUT = gql`
    mutation FBInitiateCheckout($cartId: String!) {
        fbInitiateCheckout(cartId: $cartId) {
            ...FacebookConfigDataFragment
        }
    }
    ${configDataFragment}
`;

export const FB_PURCHASE = gql`
    mutation FBPurchase($orderId: String!) {
        fbPurchase(orderId: $orderId) {
            ...FacebookConfigDataFragment
        }
    }
    ${configDataFragment}
`;

export const FB_GET_CART_DETAILS = gql`
    query FBGetCartDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            items {
                id
                prices {
                    price {
                        currency
                        value
                    }
                }
                product {
                    id
                    sku
                }
                quantity
            }
            ...PriceSummaryFragment
        }
    }
    ${PriceSummaryFragment}
`;
