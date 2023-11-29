import React from 'react';
import { useIntl } from 'react-intl';

import AccountPageWrapper from '../AccountPageWrapper';

import { useScreenSize } from '@app/hooks/useScreenSize';
import StripeContextProvider from '@app/talons/Stripe/stripeContextProvider';
import OrderHistoryPage from '@magento/venia-ui/lib/components/OrderHistoryPage';
import AuthRoute from '@magento/venia-ui/lib/components/Routes/authRoute';

import classes from './myAccountPage.module.css';
import AccountInformation from './Sections/accountInformation';
import AddressBook from './Sections/addressBook';
import Newsletter from './Sections/newsletter';
import PaymentMethods from './Sections/paymentMethods';

const ConditionalWrapper = props => (props.condition ? props.children : null);

const MyAccountPage = () => {
    const { isTrueMobileScreen } = useScreenSize();

    const { formatMessage } = useIntl();

    const PAGE_TITLE = formatMessage({
        id: 'myAccount.pageTitleText',
        defaultMessage: 'My Account'
    });

    return (
        <AuthRoute redirectTo={'/sign-in'}>
            <StripeContextProvider>
                <AccountPageWrapper pageTitle={PAGE_TITLE} path={'/account'}>
                    <div className={classes.root}>
                        <AccountInformation />
                        <ConditionalWrapper condition={!isTrueMobileScreen}>
                            <AddressBook />
                            <PaymentMethods />
                            <OrderHistoryPage pageSizeProp={5} isOrderHistoryPage={false} />
                        </ConditionalWrapper>
                        <Newsletter />
                    </div>
                </AccountPageWrapper>
            </StripeContextProvider>
        </AuthRoute>
    );
};

export default MyAccountPage;
