import { gql } from '@apollo/client';

export const GET_STORE_CONFIG = gql`
    query GetStoreConfigForYotpo {
        storeConfig {
            id
            yotpo_api_key
            yotpo_token
        }
    }
`;

export default {
    getStoreConfigQuery: GET_STORE_CONFIG
};
