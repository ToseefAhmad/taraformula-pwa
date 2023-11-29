import { useQuery } from '@apollo/client';
import OPERATIONS from '@magebit/pwa-studio-stripe/src/talons/stripe.gql';
import { useMemo } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import DEFAULT_OPERATION from '@magento/peregrine/lib/talons/AddressBookPage/addressBookPage.gql';

export const useStripeSavedCards = ({ isGuestCheckout }) => {
    const [{ isSignedIn }] = useUserContext();

    const { data, loading } = useQuery(OPERATIONS.getSavedCardsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !isSignedIn && isGuestCheckout
    });

    const { data: customerAddressesData } = useQuery(DEFAULT_OPERATION.getCustomerAddressesQuery, {
        fetchPolicy: 'cache-and-network',
        skip: !isSignedIn && isGuestCheckout
    });

    const billingAddress = useMemo(() => {
        return (
            (customerAddressesData &&
                customerAddressesData.customer &&
                customerAddressesData.customer.addresses.find(address => address.default_billing)) ||
            []
        );
    }, [customerAddressesData]);

    return {
        savedCards: data,
        isFetching: loading,
        billingAddress
    };
};
