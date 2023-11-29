import { array, func, shape, string } from 'prop-types';
import React, { useCallback, useEffect, useRef } from 'react';
import { AlertCircle as AlertCircleIcon, CloudOff as CloudOffIcon, Wifi as WifiIcon } from 'react-feather';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import DialogContainer from '@app/components/App/DialogContainer';
import GTMVariables from '@app/components/GTMVariables';
import { useTabbyPromoScript } from '@app/components/TabbyPromo/useTabbyPromoScript';
import WhatsApp from '@app/components/WhatsApp';
import { useYotpoConfig } from '@app/components/Yotpo/useYotpoConfig';
import { useYotpoReviews } from '@app/components/Yotpo/useYotpoReviews';
import { useAppContext } from '@app/context/App';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import useTracking from '@app/hooks/useTracking/useTracking';
import useDelayedTransition from '@magento/peregrine/lib/hooks/useDelayedTransition';
import { useApp } from '@magento/peregrine/lib/talons/App/useApp';
import { HeadProvider, StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Main from '@magento/venia-ui/lib/components/Main';
import Mask from '@magento/venia-ui/lib/components/Mask';
import Routes from '@magento/venia-ui/lib/components/Routes';
import ToastContainer from '@magento/venia-ui/lib/components/ToastContainer';
import globalCSS from '@magento/venia-ui/lib/index.module.css';

const OnlineIcon = <Icon src={WifiIcon} attrs={{ width: 18 }} />;
const OfflineIcon = <Icon src={CloudOffIcon} attrs={{ width: 18 }} />;
const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

const App = props => {
    const { markErrorHandled, renderError, unhandledErrors } = props;
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    useDelayedTransition();
    const { storeConfig } = useYotpoConfig();
    useYotpoReviews(storeConfig.yotpo_api_key);
    useTabbyPromoScript();

    const initialized = useRef(false);
    const { trackPageView } = useTracking();
    const history = useHistory();

    useEffect(() => {
        if (initialized.current) {
            return;
        }

        initialized.current = true;
        trackPageView(); // Initial load page view
        history.listen((_, actionType) => {
            if (actionType === 'PUSH') {
                // Ignore REPLACE/POP action types
                trackPageView();
            }
        });
    }, [history, trackPageView]);

    const ERROR_MESSAGE = formatMessage({
        id: 'app.errorUnexpected',
        defaultMessage: 'Sorry! An unexpected error occurred.'
    });

    const handleIsOffline = useCallback(() => {
        addToast({
            type: ToastType.ERROR,
            icon: OfflineIcon,
            message: formatMessage({
                id: 'app.errorOffline',
                defaultMessage: 'You are offline. Some features may be unavailable.'
            }),
            timeout: false
        });
    }, [addToast, formatMessage]);

    const handleIsOnline = useCallback(() => {
        addToast({
            type: ToastType.INFO,
            icon: OnlineIcon,
            message: formatMessage({
                id: 'app.infoOnline',
                defaultMessage: 'You are online.'
            })
        });
    }, [addToast, formatMessage]);

    const handleError = useCallback(
        (error, id, loc, handleDismissError) => {
            const errorToastProps = {
                type: ToastType.ERROR,
                icon: ErrorIcon,
                message: `${ERROR_MESSAGE}\nDebug: ${id} ${loc}`,
                onDismiss: remove => {
                    handleDismissError();
                    remove();
                },
                timeout: false
            };

            addToast(errorToastProps);
        },
        [ERROR_MESSAGE, addToast]
    );

    const talonProps = useApp({
        handleError,
        handleIsOffline,
        handleIsOnline,
        markErrorHandled,
        renderError,
        unhandledErrors
    });

    const [appState] = useAppContext();

    const { hasOverlay, handleCloseDrawer } = talonProps;

    if (renderError) {
        return (
            <HeadProvider>
                <StoreTitle />
                <Main isMasked={true} />
                <Mask isActive={true} />
                <ToastContainer />
            </HeadProvider>
        );
    }

    return (
        <HeadProvider>
            <StoreTitle />
            <Routes />
            <Mask isActive={hasOverlay} dismiss={appState.canCloseDrawer ? handleCloseDrawer : undefined} />
            <ToastContainer />
            <DialogContainer />
            <GTMVariables />
            <WhatsApp />
        </HeadProvider>
    );
};

App.propTypes = {
    markErrorHandled: func.isRequired,
    renderError: shape({
        stack: string
    }),
    unhandledErrors: array
};

App.globalCSS = globalCSS;

export default App;
