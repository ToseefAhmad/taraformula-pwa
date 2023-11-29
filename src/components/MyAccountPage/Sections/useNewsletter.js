import { useMutation, useQuery } from '@apollo/client';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import DEFAULT_OPERATIONS from '@app/components/overrides/Newsletter/newsletter.gql';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useNewsletter = () => {
    const [{ isSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const { updateSubscriptionMutation, getSubscriptionStatusQuery } = DEFAULT_OPERATIONS;

    const { data: subscriptionData, loading, error: subscriptionDataError } = useQuery(getSubscriptionStatusQuery, {
        skip: !isSignedIn,
        fetchPolicy: 'no-cache'
    });
    const initialValue = subscriptionData && subscriptionData.customer.is_subscribed;

    const [setNewsletterSubscription, { error: setNewsletterSubscriptionError, loading: isSubmitting }] = useMutation(
        updateSubscriptionMutation
    );

    const handleSubmit = useCallback(
        async ({ isSubscribed }) => {
            try {
                await setNewsletterSubscription({
                    variables: {
                        isSubscribed
                    }
                });
            } catch (error) {
                addToast({
                    type: ToastType.ERROR,
                    message: error.message,
                    timeout: false
                });
            } finally {
                addToast({
                    type: ToastType.SUCCESS,
                    message: isSubscribed
                        ? formatMessage({
                              id: 'newsletter.subscriptionAdded',
                              defaultMessage: 'Thank you for your subscription.'
                          })
                        : formatMessage({
                              id: 'newsletter.subscriptionRemoved',
                              defaultMessage: 'You have unsubscribed from our newsletter'
                          }),
                    timeout: 5000
                });
            }
        },
        [addToast, formatMessage, setNewsletterSubscription]
    );

    return {
        formErrors: [setNewsletterSubscriptionError, subscriptionDataError],
        initialValue,
        handleSubmit,
        isBusy: isSubmitting,
        isLoading: loading
    };
};
