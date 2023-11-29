import { useMutation } from '@apollo/client';
import OPERATIONS from '@magebit/pwa-studio-stripe/src/talons/stripe.gql';
import { CardCvcElement, CardExpiryElement, CardNumberElement } from '@stripe/react-stripe-js';
import React, { useCallback, useState } from 'react';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useStripeContext } from '@app/talons/Stripe/stripeContextProvider';
import Icon from '@magento/venia-ui/lib/components/Icon';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

export const useStripeSavedCardsPage = props => {
    const { stripeState, savedCards, isFetching, nameOnCard, setStripeSavedCards, stripeConfig } = useStripeContext();
    const [deleteSavedCard, { error: deleteSavedCardError, loading: deleteSavedCardLoading }] = useMutation(
        OPERATIONS.deleteSavedCard
    );
    const [saveNewCard, { error: saveNewCardError, loading: saveNewCardLoading }] = useMutation(OPERATIONS.saveNewCard);

    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const [confirmDeleteCardId, setConfirmDeleteCardId] = useState();

    const handleSave = async () => {
        const { stripe, elements } = props;

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardNumberElement);
        const expiryElement = elements.getElement(CardExpiryElement);
        const cvcElement = elements.getElement(CardCvcElement);

        if (!cardElement || !expiryElement || !cvcElement) {
            return;
        }

        const result = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement
        });

        if (result.error) {
            console.error(result);
            return;
        }

        try {
            const { data } = await saveNewCard({
                variables: {
                    token:
                        result.paymentMethod.id +
                        ':' +
                        result.paymentMethod.card.brand +
                        ':' +
                        result.paymentMethod.card.last4
                }
            });
            if (data) {
                setStripeSavedCards(data.saveStripeCard.savedCards);
            }
            addToast({
                type: ToastType.SUCCESS,
                message: formatMessage({
                    id: 'savedCardsPage.successCreate',
                    defaultMessage: 'Payment method has been saved.'
                })
            });
        } catch (e) {
            let message;

            if (e && e.message) {
                message = e.message;
            } else if (saveNewCardError && saveNewCardError.message) {
                message = saveNewCardError.message;
            } else {
                message = formatMessage({
                    id: 'savedCardsPage.saveCardError',
                    defaultMessage: 'We were unable to save your payment method. Please, try again!'
                });
            }

            addToast({
                type: ToastType.ERROR,
                icon: errorIcon,
                message: message,
                dismissable: true
            });
        }
    };

    const handleDelete = async cardToDelete => {
        setConfirmDeleteCardId(cardToDelete.id);
    };

    const handleCancelDelete = useCallback(() => {
        setConfirmDeleteCardId(null);
    }, []);

    const handleConfirmDelete = async () => {
        try {
            const { data } = await deleteSavedCard({
                variables: {
                    cardId: confirmDeleteCardId
                }
            });
            if (data) {
                setStripeSavedCards(data.deleteStripeSavedCard.savedCards);
            }
            addToast({
                type: ToastType.SUCCESS,
                message: formatMessage({
                    id: 'savedCardsPage.successDelete',
                    defaultMessage: 'Payment method has been deleted.'
                })
            });
        } catch (e) {
            const message =
                deleteSavedCardError && deleteSavedCardError.message
                    ? deleteSavedCardError.message
                    : formatMessage({
                          id: 'savedCardsPage.deleteCardError',
                          defaultMessage: 'We were unable to delete your payment method. Please, try again!'
                      });
            addToast({
                type: ToastType.ERROR,
                icon: errorIcon,
                message,
                dismissable: true
            });
        }
    };

    return {
        handleSave,
        handleDelete,
        handleConfirmDelete,
        handleCancelDelete,
        deleteSavedCardLoading,
        saveNewCardLoading,
        savedCards,
        isFetching,
        nameOnCard,
        confirmDeleteCardId,
        stripeState,
        stripeConfig
    };
};
