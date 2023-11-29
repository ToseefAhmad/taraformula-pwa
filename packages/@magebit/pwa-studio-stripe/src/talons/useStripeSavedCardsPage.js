import {useMutation} from '@apollo/client';
import {useStripeContext} from '@magebit/pwa-studio-stripe/src/context/stripeContextProvider';
import {CardCvcElement, CardExpiryElement, CardNumberElement} from '@stripe/react-stripe-js';
import {useMemo} from 'react';

import OPERATIONS from './stripe.gql';

export const useStripeSavedCardsPage = props => {
    const {
        stripeState,
        savedCards,
        setStripeSavedCards
    } = useStripeContext();

    const [
        deleteSavedCard,
        {
            error: deleteSavedCardError,
            loading: deleteSavedCardLoading
        }
    ] = useMutation(OPERATIONS.deleteSavedCard);

    const [
        saveNewCard,
        {
            error: saveNewCardError,
            loading: saveNewCardLoading
        }
    ] = useMutation(OPERATIONS.saveNewCard);

    const handleDelete = async (cardToDelete) => {
        try {
            const {data} = await deleteSavedCard({
                variables: {
                    cardId: cardToDelete.id
                }
            });
            if (data) {
                setStripeSavedCards(data.deleteStripeSavedCard.savedCards)
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleSave = async () => {
        const {stripe, elements} = props;

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
            console.error(result)
            return;
        }

        try {
            const {data} = await saveNewCard({
                variables: {
                    token: result.paymentMethod.id + ':' + result.paymentMethod.card.brand + ':' + result.paymentMethod.card.last4
                }
            });
            if (data) {
                setStripeSavedCards(data.saveStripeCard.savedCards)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const deleteCardError = useMemo(() => {
        if (deleteSavedCardError) {
            return deleteSavedCardError
        }
    }, [deleteSavedCardError]);

    return {
        handleDelete,
        handleSave,
        deleteSavedCardLoading,
        saveNewCardLoading,
        savedCards,
        deleteCardError,
        hasDeleteCardError: !!deleteCardError,
        saveNewCardError,
        hasSaveNewCardError: !!saveNewCardError,
        stripeState
    };
};
