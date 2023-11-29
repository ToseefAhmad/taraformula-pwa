import { gql } from '@apollo/client';

export const GET_SOCIAL_LOGIN_BUTTON_CONFIG = gql`
    query GetSocialLoginButtonConfig {
        amSocialLoginButtonConfig {
            type
            label
        }
    }
`;

export const GET_SOCIAL_LOGIN_URL = gql`
    mutation GetSocialLoginUrl($type: String!) {
        getSocialLoginUrl(type: $type)
    }
`;

export const GET_SOC_ACCOUNT_DATA = gql`
    query amSocialLoginAccountData {
        amSocialLoginAccountData {
            type
            name
        }
    }
`;
