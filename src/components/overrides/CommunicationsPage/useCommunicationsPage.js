import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CommunicationsPage/communicationsPage.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useCommunicationsPage = props => {
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCustomerSubscriptionQuery, setNewsletterSubscriptionMutation } = operations;

    const [{ isSignedIn }] = useUserContext();

    const { data: subscriptionData, error: subscriptionDataError } = useQuery(getCustomerSubscriptionQuery, {
        skip: !isSignedIn
    });

    const initialValues = useMemo(() => {
        if (subscriptionData) {
            return { isSubscribed: subscriptionData.customer.is_subscribed };
        }
    }, [subscriptionData]);

    const [setNewsletterSubscription, { error: setNewsletterSubscriptionError, loading: isSubmitting }] = useMutation(
        setNewsletterSubscriptionMutation
    );

    const handleSubmit = useCallback(
        async formValues => {
            try {
                await setNewsletterSubscription({
                    variables: formValues
                });
            } catch (error) {
                addToast({
                    type: ToastType.ERROR,
                    message: error.message,
                    timeout: false
                });
                return;
            }
            addToast({
                type: ToastType.SUCCESS,
                message: formValues.isSubscribed
                    ? formatMessage({
                          id: 'newsletter.subscriptionAdded',
                          defaultMessage: 'Thank you for your subscription.'
                      })
                    : formatMessage({
                          id: 'newsletter.subscriptionRemoved',
                          defaultMessage: 'We have removed your newsletter subscription.'
                      })
            });
        },
        [addToast, formatMessage, setNewsletterSubscription]
    );

    return {
        formErrors: [setNewsletterSubscriptionError, subscriptionDataError],
        initialValues,
        handleSubmit,
        isDisabled: isSubmitting
    };
};
