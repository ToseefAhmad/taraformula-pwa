import { gql } from '@apollo/client';
export const SUBSCRIBE_TO_NEWSLETTER = gql`
    mutation SubscribeToNewsletter($email: String!) {
        subscribeEmailToNewsletter(email: $email) {
            status
        }
    }
`;

export const SET_NEWSLETTER_SUBSCRIPTION = gql`
    mutation SetNewsletterSubscription($isSubscribed: Boolean!) {
        updateCustomerV2(input: { is_subscribed: $isSubscribed }) {
            customer {
                id
                is_subscribed
            }
        }
    }
`;

export const GET_CUSTOMER_SUBSCRIPTION = gql`
    query GetCustomerSubscription {
        customer {
            id
            is_subscribed
        }
    }
`;

export default {
    subscribeMutation: SUBSCRIBE_TO_NEWSLETTER,
    updateSubscriptionMutation: SET_NEWSLETTER_SUBSCRIPTION,
    getSubscriptionStatusQuery: GET_CUSTOMER_SUBSCRIPTION
};
