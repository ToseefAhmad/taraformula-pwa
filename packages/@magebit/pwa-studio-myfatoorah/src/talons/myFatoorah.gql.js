import { gql } from '@apollo/client';

export const GET_SESSION_ID = gql`
    query getSessionId {
        getMyFatoorahSessionId {
            session_id,
            country,
            is_testing
        }
    }
`;

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart(
        $cartId: String!
    ) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId,
                payment_method: {
                    code: "embedpay"
                }
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

export const SET_GATEWAY_ON_CART = gql`
    mutation setPaymentMethodOnCart(
        $cartId: String!
    ) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId,
                payment_method: {
                    code: "myfatoorah_gateway"
                }
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

export const GET_REDIRECT_URL = gql`
    mutation getRedirectUrl(
        $orderId: String!
        $sessionId: String
        $gateway: String
    ) {
        getMyFatoorahRedirectUrl(
            input: {
                order_id: $orderId,
                session_id: $sessionId,
                gateway: $gateway
            }
        ) {
            redirect_url
            gateway_name
            gateway_code
        }
    }
`;

export const GET_PAYMENT_VALIDATION = gql`
    mutation getPaymentValidation(
        $paymentId: String!
    ) {
        getMyFatoorahPaymentValidation(
            input: {
                payment_id: $paymentId
            }
        ) {
            status
            quote_id
        }
    }
`;

export const GET_GATEWAY_CONFIG_DATA = gql`
    query storeConfigData {
        storeConfig {
            myfatoorah_gateway_enabled
        }
    }
`;

export default {
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART,
    setGatewayCartMutation: SET_GATEWAY_ON_CART,
    getSessionId: GET_SESSION_ID,
    getRedirectUrl: GET_REDIRECT_URL,
    getPaymentValidation: GET_PAYMENT_VALIDATION,
    getGatewayConfigQuery: GET_GATEWAY_CONFIG_DATA
};
