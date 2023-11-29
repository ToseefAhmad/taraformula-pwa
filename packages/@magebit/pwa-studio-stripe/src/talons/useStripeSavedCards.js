import { useQuery } from '@apollo/client';

import OPERATIONS from './stripe.gql';

export const useStripeSavedCards = ({isGuestCheckout}) => {
    const { data } = useQuery(OPERATIONS.getSavedCardsQuery, {
        fetchPolicy: 'no-cache',
        skip: isGuestCheckout
    });

    return {
        savedCards: data
    };
};
