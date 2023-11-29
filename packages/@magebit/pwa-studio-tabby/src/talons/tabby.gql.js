import gql from "graphql-tag";

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart(
        $cartId: String!,
        $code: String!
    ) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId,
                payment_method: {
                    code: $code
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


export default {
    setPaymentMethodOnCart: SET_PAYMENT_METHOD_ON_CART
};
