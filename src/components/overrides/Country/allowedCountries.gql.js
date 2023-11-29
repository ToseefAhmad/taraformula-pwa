import { gql } from '@apollo/client';

export const GET_ALLOWED_COUNTRIES_QUERY = gql`
    query GetAllowedCountries {
        allowedCountries {
            countries {
                id
                full_name_english
                two_letter_abbreviation
            }
        }
    }
`;
