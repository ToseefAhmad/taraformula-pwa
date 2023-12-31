import { gql } from '@apollo/client';

export const GET_SUMMARY_DATA = gql`
    query getSummaryData($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            isBillingAddressSame @client
            paymentNonce @client
            billingAddress: billing_address {
                firstName: firstname
                lastName: lastname
                country {
                    code
                }
                street
                city
                region {
                    label
                }
                postalCode: postcode
                phoneNumber: telephone
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
            }
        }
    }
`;

export default {
    queries: {
        getBraintreeSummaryData: GET_SUMMARY_DATA
    },
    mutations: {}
};
