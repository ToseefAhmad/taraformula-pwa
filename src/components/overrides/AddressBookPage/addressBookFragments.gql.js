import { gql } from '@apollo/client';

export const CustomerAddressBookAddressFragment = gql`
    fragment CustomerAddressBookAddressFragment on CustomerAddress {
        __typename
        id
        city
        country_code
        default_billing
        default_shipping
        firstname
        lastname
        middlename
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
