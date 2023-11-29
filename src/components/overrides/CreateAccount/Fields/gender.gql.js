import { gql } from '@apollo/client';

export const GET_GENDER_ATTRIBUTE_QUERY = gql`
    query getGenderAttributes {
        customAttributeMetadata(attributes: [{ attribute_code: "gender", entity_type: "customer" }]) {
            items {
                attribute_code
                attribute_options {
                    value
                    label
                }
            }
        }
    }
`;
