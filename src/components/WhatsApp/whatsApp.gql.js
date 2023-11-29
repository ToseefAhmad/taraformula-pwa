import { gql } from '@apollo/client';

export const GET_WHATS_APP_CONFIGS = gql`
    query whatsappConfigs {
        whatsappConfigs {
            enabled
            number
            defaultMessage
            iconWidth
            iconPosition
            iconMargin
        }
    }
`;
