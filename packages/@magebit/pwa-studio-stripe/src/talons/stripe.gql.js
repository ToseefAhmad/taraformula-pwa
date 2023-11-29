import { gql } from '@apollo/client';

export const GET_STRIPE_CONFIG_DATA = gql`
    query storeConfigData {
        storeConfig {
            stripe_cc_enabled
            stripe_mode
            stripe_public_key_test
            stripe_public_key_live
            stripe_save_customer_cards
        }
    }
`;

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart(
        $cartId: String!,
        $ccToken: String!,
        $ccSave: Boolean!,
        $ccSaved: String!,
        $selectedPlan: String!
    ) {
        setPaymentMethodOnCart(
            input: {
                cart_id: $cartId,
                payment_method: {
                    code: "stripe_payments",
                    stripe_payments: {
                        cc_stripejs_token: $ccToken,
                        cc_save: $ccSave,
                        selected_plan: $selectedPlan
                        cc_saved: $ccSaved
                    }
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

export const GET_SAVED_CARDS = gql`
    query GetSavedCards {
        savedCards {
            brand
            id
            last4
            exp_month
            exp_year
        }
    }
`;

export const DELETE_SAVED_CARD = gql`
    mutation deleteSavedCard(
        $cardId: String!,
    ) {
        deleteStripeSavedCard(
            input: {
                card_id: $cardId
            }
        ) {
            savedCards {
                brand
                id
                last4
                exp_month
                exp_year
            }
        }
    }
`;

export const SAVE_NEW_CARD = gql`
    mutation saveNewCard(
        $token: String!,
    ) {
        saveStripeCard(
            input: {
                cc_stripejs_token: $token
            }
        ) {
            savedCards {
                brand
                id
                last4
                exp_month
                exp_year
            }
        }
    }
`;

export default {
    getStripeConfigQuery: GET_STRIPE_CONFIG_DATA,
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART,
    getSavedCardsQuery: GET_SAVED_CARDS,
    deleteSavedCard: DELETE_SAVED_CARD,
    saveNewCard: SAVE_NEW_CARD
};
