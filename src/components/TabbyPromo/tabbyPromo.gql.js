import { gql } from '@apollo/client';

export const GET_TABBY_CONFIG = gql`
    query GetTabbyConfig {
        storeConfig {
            tabby_public_key
            tabby_installments_enabled
        }
    }
`;
