import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import StripeContextProvider from '@app/talons/Stripe/stripeContextProvider';
import AuthRoute from '@magento/venia-ui/lib/components/Routes/authRoute';

import SavedCards from './savedCards';

const SavedCardsPage = () => {
    const { formatMessage } = useIntl();

    const [pageTitle, setPageTitle] = useState(
        formatMessage({
            id: 'stripe.defaultPageTitleText',
            defaultMessage: 'Payment Methods'
        })
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCancel = useCallback(() => {
        setIsDialogOpen(false);
        setPageTitle(
            formatMessage({
                id: 'stripe.defaultPageTitleText',
                defaultMessage: 'Payment Methods'
            })
        );
    }, [formatMessage]);

    const handleAdd = useCallback(() => {
        setIsDialogOpen(true);
        setPageTitle(
            formatMessage({
                id: 'stripe.addCardPageTitleText',
                defaultMessage: 'Add Payment'
            })
        );
    }, [formatMessage]);

    return (
        <AuthRoute redirectTo={'/sign-in'}>
            <StripeContextProvider redirectIfDisabled={true}>
                <AccountPageWrapper pageTitle={pageTitle} path={'/payment-methods'}>
                    <SavedCards handleAdd={handleAdd} handleCancel={handleCancel} isDialogOpen={isDialogOpen} />
                </AccountPageWrapper>
            </StripeContextProvider>
        </AuthRoute>
    );
};

export default SavedCardsPage;
