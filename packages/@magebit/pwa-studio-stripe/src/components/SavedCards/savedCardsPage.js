import StripeContextProvider from '@magebit/pwa-studio-stripe/src/context/stripeContextProvider';
import React from 'react';
import {useIntl} from "react-intl";

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import {StoreTitle} from '@magento/venia-ui/lib/components/Head';
import AuthRoute from '@magento/venia-ui/lib/components/Routes/authRoute';

import AddCard from './addCard'
import SavedCards from './savedCards'
import classes from "./savedCardsPage.module.css";

const SavedCardsPage = () => {

    const { formatMessage } = useIntl();

    return (
        <AuthRoute redirectTo={'/sign-in'}>
            <div className={classes.root}>
                <StoreTitle>
                    {formatMessage({
                        id: 'stripe.savedCards',
                        defaultMessage: 'My Saved Cards'
                    })}
                </StoreTitle>
                <AccountPageWrapper pageTitle="My Saved Cards">
                    <StripeContextProvider disabledMessage={
                        formatMessage({
                            id: 'stripe.savedCardsNotAvailable',
                            defaultMessage: 'Stripe saved cards are not available in this store.'
                        })
                    }>
                        <div className={classes.content}>
                            <div className={classes.savedCardsContainer}>
                                <SavedCards />
                            </div>
                            <div className={classes.addSavedCardContainer}>
                                <AddCard />
                            </div>
                        </div>
                    </StripeContextProvider>
                </AccountPageWrapper>
            </div>
        </AuthRoute>
    );
};

export default SavedCardsPage;
