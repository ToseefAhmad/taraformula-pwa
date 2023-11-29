import { gql } from '@apollo/client';

export const GET_CITY_CARRIERS = gql`
    query getCountryShippingMethods {
        getCountryShippingMethods {
            city
            shipping_methods
            default
        }
    }
`;
