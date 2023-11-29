import { gql } from '@apollo/client';

import { PriceSummaryFragment } from '../../CartPage/PriceSummary/priceSummaryFragments.gql';
import { AvailablePaymentMethodsFragment } from '../PaymentInformation/paymentInformation.gql';

export const GET_IS_BILLING_ADDRESS_SAME = gql`
    query getIsBillingAddressSame($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            isBillingAddressSame
        }
    }
`;

export const GET_BILLING_ADDRESS = gql`
    query getBillingAddress($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            billingAddress: billing_address {
                firstName: firstname
                lastName: lastname
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
                phoneNumber: telephone
                area
                block
                neighborhood
                avenue
                zone
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

export const GET_SHIPPING_ADDRESS = gql`
    query getSelectedShippingAddress($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            shippingAddresses: shipping_addresses {
                firstName: firstname
                lastName: lastname
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

export const SET_BILLING_ADDRESS = gql`
    mutation setBillingAddress(
        $cartId: String!
        $firstName: String!
        $lastName: String!
        $street1: String!
        $street2: String
        $city: String!
        $region: String!
        $postcode: String
        $country: String!
        $phoneNumber: String!
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
                        firstname: $firstName
                        lastname: $lastName
                        street: [$street1, $street2]
                        city: $city
                        region: $region
                        postcode: $postcode
                        country_code: $country
                        telephone: $phoneNumber
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

export default {
    getBillingAddressQuery: GET_BILLING_ADDRESS,
    getIsBillingAddressSameQuery: GET_IS_BILLING_ADDRESS_SAME,
    getShippingAddressQuery: GET_SHIPPING_ADDRESS,
    setBillingAddressMutation: SET_BILLING_ADDRESS
};
