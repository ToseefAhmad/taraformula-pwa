import { gql } from '@apollo/client';

export const GET_CASHONDELIVERY_CONFIG_DATA = gql`
    query storeConfigDataForCashOnDelivery {
        storeConfig {
            payment_cod_fee_disclaimer
        }
    }
`;

export default {
    getCashondeliveryConfigData: GET_CASHONDELIVERY_CONFIG_DATA
};
