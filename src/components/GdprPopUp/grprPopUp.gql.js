import { gql } from '@apollo/client';

export const GET_COOKIE_BANNER_CONFIG = gql`
    query GetCookieBannerConfig {
        getCookieBannerConfig {
            id
            enabled
            country
            notificationText
            groups {
                id
                name
                is_essential
            }
        }
    }
`;

export const SET_COOKIE_CONSENT = gql`
    mutation SetCookieConsent($groupIds: [Int] = [], $isAllAllowed: Boolean = false) {
        setCookieConsent(groupIds: $groupIds, isAllAllowed: $isAllAllowed)
    }
`;
