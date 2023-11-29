import { gql } from '@apollo/client';

export const CustomerAddressFragment = gql`
    fragment CustomerAddressFragment on CustomerAddress {
        id
        city
        country_code
        default_shipping
        firstname
        lastname
        postcode
        region {
            region
            region_code
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
`;

export const AddressBookFragment = gql`
    fragment AddressBookFragment on Customer {
        id
        addresses {
            id
            ...CustomerAddressFragment
        }
    }
    ${CustomerAddressFragment}
`;
