import { gql } from '@apollo/client';

export const GET_GEOLOCATION_CITY = gql`
    query getGeolocationData($coordinates: String, $ip_address: String) {
        getGeolocationData(coordinates: $coordinates, ip_address: $ip_address) {
            city
            alternate_city
        }
    }
`;
