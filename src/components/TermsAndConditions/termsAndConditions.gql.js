import { gql } from '@apollo/client';

export const GET_TERMS_AND_CONDITIONS = gql`
    query GetTermsAndConditions {
        checkoutAgreements {
            agreement_id
            content
        }
    }
`;
