import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_LOCALE = gql`
    query getStoreConfigLocale {
        storeConfig {
            id
            locale
        }
    }
`;
