import { gql } from '@apollo/client';

export const GET_FASTEST_DELIVERY_DATE = gql`
    query getFastestDeliveryDate($city: String) {
        getFastestDeliveryDate(city: $city) {
            month
            day
            dispatch_hours
            dispatch_minutes
        }
    }
`;
