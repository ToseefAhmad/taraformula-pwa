import { gql } from '@apollo/client';

import { OrderConfirmationPageFragment } from '@app/overrides/peregrine/talons/CheckoutPage/OrderConfirmationPage/orderConfirmationPageFragments.gql';

import { CheckoutPageFragment } from './checkoutPageFragments.gql';

export const CREATE_CART = gql`
    # This mutation will return a masked cart id. If a bearer token is provided for
    # a logged in user it will return the cart id for that user.
    mutation createCart {
        cartId: createEmptyCart
    }
`;

export const PLACE_ORDER = gql`
    mutation placeOrder($cartId: String!) {
        placeOrder(input: { cart_id: $cartId }) @connection(key: "placeOrder") {
            order {
                order_number
                payment {
                    last_four
                    card_type
                }
                redirect_url
                myFatoorah
            }
        }
    }
`;

export const SAVE_NEWSLETTER_CONSENT = gql`
    mutation saveNewsletterConsent($sms_consent: Boolean!, $email_consent: Boolean!, $cartId: String!) {
        saveNewsletterConsent(
            input: { sms_consent: $sms_consent, email_consent: $email_consent, masked_cart_id: $cartId }
        )
    }
`;

export const GET_NEWSLETTER_CONSENT = gql`
    query getNewsletterConsent($masked_cart_id: String!) {
        getNewsletterConsent(maskedCartId: $masked_cart_id) {
            sms_consent
            email_consent
        }
    }
`;

// A query to fetch order details _right_ before we submit, so that we can pass
// Data to the order confirmation page.
export const GET_ORDER_DETAILS = gql`
    query getOrderDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...OrderConfirmationPageFragment
        }
    }
    ${OrderConfirmationPageFragment}
`;

export const GET_CHECKOUT_DETAILS = gql`
    query getCheckoutDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

export const GET_CUSTOMER = gql`
    query GetCustomerForCheckout {
        customer {
            id
            default_shipping
            firstname
        }
    }
`;

export default {
    createCartMutation: CREATE_CART,
    getCheckoutDetailsQuery: GET_CHECKOUT_DETAILS,
    getCustomerQuery: GET_CUSTOMER,
    getOrderDetailsQuery: GET_ORDER_DETAILS,
    placeOrderMutation: PLACE_ORDER,
    getNewsletterConsentQuery: GET_NEWSLETTER_CONSENT,
    saveNewsletterConsentMutation: SAVE_NEWSLETTER_CONSENT
};
