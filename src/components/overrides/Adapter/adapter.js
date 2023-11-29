import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import StoreCodeRoute from '@app/components/overrides/StoreCodeRoute';
import { RedirectContextProvider } from '@app/context/RedirectContext/useRedirectContext';
import { useAdapter } from '@magento/peregrine/lib/talons/Adapter/useAdapter';
import App, { AppContextProvider } from '@magento/venia-ui/lib/components/App';

const Adapter = props => {
    const talonProps = useAdapter(props);
    const { apolloProps, initialized, reduxProps, routerProps, urlHasStoreCode } = talonProps;

    // eslint-disable-next-line no-warning-comments
    // TODO: Replace with app skeleton. See PWA-547.
    if (!initialized) {
        return null;
    }

    // eslint-disable-next-line react/prop-types
    const children = props.children || <App />;
    const storeCodeRouteHandler = urlHasStoreCode ? <StoreCodeRoute /> : null;

    return (
        <ApolloProvider {...apolloProps}>
            <ReduxProvider {...reduxProps}>
                <BrowserRouter {...routerProps}>
                    <RedirectContextProvider>
                        {storeCodeRouteHandler}
                        <AppContextProvider>{children}</AppContextProvider>
                    </RedirectContextProvider>
                </BrowserRouter>
            </ReduxProvider>
        </ApolloProvider>
    );
};

export default Adapter;
