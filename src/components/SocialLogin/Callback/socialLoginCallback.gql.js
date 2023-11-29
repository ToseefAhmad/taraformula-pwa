import { gql } from '@apollo/client';

export const SOCIAL_LOGIN_ACTION = gql`
    mutation SocialLoginAction($code: String!, $state: String!) {
        socialLoginAction(code: $code, state: $state)
    }
`;
