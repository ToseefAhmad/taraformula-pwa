import { object } from 'prop-types';
import React, { Fragment, Suspense } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import { useStores } from '@app/hooks/useStores/useStores';
import StripeContextProvider from '@app/talons/Stripe/stripeContextProvider';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAccountInformationPage } from '@magento/peregrine/lib/talons/AccountInformationPage/useAccountInformationPage';
import EditForm from '@magento/venia-ui/lib/components/AccountInformationPage/editForm';
import { Message } from '@magento/venia-ui/lib/components/Field';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import AuthRoute from '@magento/venia-ui/lib/components/Routes/authRoute';

import AccountInformationPageOperations from './accountInformationPage.gql.js';
import classes from './accountInformationPage.module.css';
import SocialProfiles from './socialProfiles';

const AccountInformationPage = () => {
    const {
        handleCancel,
        formErrors,
        handleEmailChange,
        handleChangePassword,
        handleCancelChangePassword,
        handleSubmit,
        initialValues,
        loadDataError,
        shouldShowNewPassword,
        shouldRequestPassword,
        isDisabled,
        slug
    } = useAccountInformationPage({
        ...AccountInformationPageOperations
    });

    const { formatMessage } = useIntl();
    const { currentStoreCode } = useStores();
    const [{ isSignedIn }] = useUserContext();

    if (!isSignedIn) {
        return <AuthRoute redirectTo="/sign-in" />;
    }

    if (slug) {
        history.replaceState(null, null, `/${currentStoreCode}/account-information`);
    }

    const PAGE_TITLE = formatMessage({
        id: 'accountInformationPage.accountInformation',
        defaultMessage: 'Account Information'
    });

    const errorMessage = loadDataError ? (
        <Message>
            <FormattedMessage
                id={'accountInformationPage.errorTryAgain'}
                defaultMessage={'Something went wrong. Please refresh and try again.'}
            />
        </Message>
    ) : null;

    if (!initialValues) {
        return fullPageLoadingIndicator;
    }

    const { customer } = initialValues;

    const pageContent = (
        <Fragment>
            <div className={classes.section}>
                <div className={classes.contactSectionTitle}>
                    <FormattedMessage
                        id={'accountInformationPage.contactSectionTitle'}
                        defaultMessage={'Contact information'}
                    />
                </div>
                <Suspense fallback={null}>
                    <EditForm
                        formErrors={formErrors}
                        initialValues={customer}
                        handleCancel={handleCancel}
                        handleChangePassword={handleChangePassword}
                        handleCancelChangePassword={handleCancelChangePassword}
                        handleSubmit={handleSubmit}
                        handleEmailChange={handleEmailChange}
                        shouldShowNewPassword={shouldShowNewPassword}
                        shouldRequestPassword={shouldRequestPassword}
                        isDisabled={isDisabled}
                    />
                </Suspense>
            </div>
            <div className={classes.section}>
                <SocialProfiles />
            </div>
        </Fragment>
    );

    return (
        <StripeContextProvider>
            <AccountPageWrapper pageTitle={PAGE_TITLE} path={'/account-information'}>
                <div className={classes.root}>{errorMessage ? errorMessage : pageContent}</div>
            </AccountPageWrapper>
        </StripeContextProvider>
    );
};

AccountInformationPage.propTypes = {
    classes: object
};

export default AccountInformationPage;
