import { gql } from '@apollo/client';

export const GET_COOKIE_BANNER_CONFIG = gql`
    query CookieBannerConfig {
        CookieBannerConfig {
            id
            notificationText
            groups {
                id
                name
                description
                is_essential
                is_enabled
                sort_order
                cookies
            }
        }
    }
`;
