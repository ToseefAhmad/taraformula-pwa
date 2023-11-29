import { gql } from '@apollo/client';

export const ShippingInformationFragment = gql`
    fragment ShippingInformationFragment on Cart {
        id
        email
        shipping_addresses {
            city
            country {
                code
                label
            }
            firstname
            lastname
            postcode
            region {
                code
                label
                region_id
            }
            street
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
    }
`;
