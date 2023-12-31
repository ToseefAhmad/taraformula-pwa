import { gql } from '@apollo/client';

export const ShippingSummaryFragment = gql`
    fragment ShippingSummaryFragment on Cart {
        id
        shipping_addresses {
            selected_shipping_method {
                method_title
                amount {
                    currency
                    value
                }
            }
            street
            city
        }
    }
`;
