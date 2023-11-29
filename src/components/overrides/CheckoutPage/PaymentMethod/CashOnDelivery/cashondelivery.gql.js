import { gql } from '@apollo/client';

export const GET_CASHONDELIVERY_CONFIG_DATA = gql`
    query storeConfigDataForCashOnDelivery {
        storeConfig {
            payment_cashondelivery_instructions
        }
    }
`;

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: { code: "cashondelivery" } }) {
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

export default {
    getCashondeliveryConfigData: GET_CASHONDELIVERY_CONFIG_DATA,
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART
};
