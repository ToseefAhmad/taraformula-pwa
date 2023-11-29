import { gql } from '@apollo/client';

import { PriceSummaryFragment } from '../../CartPage/PriceSummary/priceSummaryFragments.gql';

export const AvailablePaymentMethodsFragment = gql`
    fragment AvailablePaymentMethodsFragment on Cart {
        id
        available_payment_methods {
            code
            title
        }
    }
`;

export const GET_PAYMENT_INFORMATION = gql`
    query getPaymentInformation($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            selected_payment_method {
                code
            }
            shipping_addresses {
                firstname
                lastname
                street
                city
                region {
                    code
                    label
                    region_id
                }
                postcode
                country {
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
            }
            ...AvailablePaymentMethodsFragment
        }
    }
    ${AvailablePaymentMethodsFragment}
`;

export const GET_PAYMENT_NONCE = gql`
    query getPaymentNonce($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            paymentNonce
        }
    }
`;

export const SET_BILLING_ADDRESS = gql`
    mutation setBillingAddress(
        $cartId: String!
        $firstname: String!
        $lastname: String!
        $street: [String]!
        $city: String!
        $regionCode: String!
        $postcode: String
        $countryCode: String!
        $telephone: String!
        $block: String
        $area: String
        $neighborhood: String
        $zone: String
        $avenue: String
        $houseBuilding: String
        $floor: String
        $building: String
        $flat: String
        $postalCode: String
        $additionalNumbers: String
        $idNumber: String
    ) {
        setBillingAddressOnCart(
            input: {
                cart_id: $cartId
                billing_address: {
                    address: {
                        firstname: $firstname
                        lastname: $lastname
                        street: $street
                        city: $city
                        region: $regionCode
                        postcode: $postcode
                        country_code: $countryCode
                        telephone: $telephone
                        area: $area
                        block: $block
                        neighborhood: $neighborhood
                        zone: $zone
                        avenue: $avenue
                        house_building: $houseBuilding
                        floor: $floor
                        building: $building
                        flat: $flat
                        postal_code: $postalCode
                        additional_numbers: $additionalNumbers
                        id_number: $idNumber
                        save_in_address_book: false
                    }
                }
            }
        ) @connection(key: "setBillingAddressOnCart") {
            cart {
                id
                billing_address {
                    firstname
                    lastname
                    country {
                        code
                    }
                    street
                    city
                    region {
                        code
                        label
                        region_id
                    }
                    postcode
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
                }
                ...PriceSummaryFragment
                ...AvailablePaymentMethodsFragment
            }
        }
    }
    ${PriceSummaryFragment}
    ${AvailablePaymentMethodsFragment}
`;

// Sets the provided payment method object on the cart.
export const SET_FREE_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: { code: "free" } })
            @connection(key: "setPaymentMethodOnCart") {
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
    getPaymentNonceQuery: GET_PAYMENT_NONCE,
    getPaymentInformationQuery: GET_PAYMENT_INFORMATION,
    setBillingAddressMutation: SET_BILLING_ADDRESS,
    setFreePaymentMethodMutation: SET_FREE_PAYMENT_METHOD_ON_CART
};
