import { gql } from '@apollo/client';

export const GET_API_COUNTRIES_QUERY = gql`
    {
        getTaraCountries {
            countries {
                id
                iso_code
                mapping {
                    address_1
                    address_2
                }
            }
        }
    }
`;

export const GET_API_ADDRESS_FIELDS = gql`
    query GetTaraAddressFields($countryId: Int!) {
        getTaraAddressFields(countryId: $countryId) {
            items {
                id
                country_id
                level
                parent_id
                parent_code
                mapped_parent_code
                code
                mapped_code
                name
                type
                placeholder
                required
            }
        }
    }
`;

export const GET_API_DATA_QUERY = gql`
    query GetTaraAddressData($addressId: Int!, $selectedValue: String, $parentId: Int, $parentField: String) {
        getTaraAddressData(
            addressId: $addressId
            selectedValue: $selectedValue
            parentId: $parentId
            parentField: $parentField
        ) {
            items {
                id
                name
            }
        }
    }
`;
