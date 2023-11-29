import { gql } from '@apollo/client';

export const CREATE_AFTERPAY_CHECKOUT = gql`
    mutation createAfterpayCheckout($cartId: String!) {
        createAfterpayCheckout(
            input: {
                cart_id: $cartId
                redirect_path: { cancel_path: "afterpay/payment/capture", confirm_path: "afterpay/payment/capture" }
            }
        ) {
            afterpay_token
            afterpay_expires
            afterpay_redirectCheckoutUrl
        }
    }
`;

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!, $afterpayToken: String!) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId
                payment_method: { code: "afterpay", afterpay: { afterpay_token: $afterpayToken } }
            }
        ) {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;
