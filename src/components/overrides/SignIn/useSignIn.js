import { useApolloClient, useMutation } from '@apollo/client';
import { useCallback, useRef, useState, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useTrackingContext } from '@app/context/Tracking';
import { useCaptcha } from '@app/hooks/useCaptcha';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import useTracking from '@app/hooks/useTracking/useTracking';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { clearCustomerDataFromCache } from '@magento/peregrine/lib/Apollo/clearCustomerDataFromCache';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { retrieveCartId } from '@magento/peregrine/lib/store/actions/cart';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/SignIn/signIn.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const ERROR_MESSAGES = {
    'The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.': {
        translationId: 'signIn.errorAuth'
    },
    'Invalid e-mail.': {
        translationId: 'signIn.errorEmail'
    },
    'Invalid password.': {
        translationId: 'signIn.errorPassword',
        link: {
            url: '/forgot-password',
            text: 'Reset password'
        }
    }
};

export const useSignIn = props => {
    const { getCartDetailsQuery, setDefaultUsername, showCreateAccount, showForgotPassword } = props;
    const [, { setUserData }] = useTrackingContext();
    const { trackUserLogin } = useTracking();
    const { formatMessage } = useIntl();
    const [
        { showAuthModal },
        {
            actions: { setShowAuthModal }
        }
    ] = useAppContext();
    const [, { addToast }] = useToasts();
    const { captchaHeaders, executeCaptchaValidation } = useCaptcha();

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { createCartMutation, getCustomerQuery, mergeCartsMutation, signInMutation } = operations;

    const apolloClient = useApolloClient();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const [{ cartId }, { createCart, removeCart, getCartDetails }] = useCartContext();

    const [{ isGettingDetails, getDetailsError }, { getUserDetails, setToken }] = useUserContext();

    const [signIn, { error: signInError }] = useMutation(signInMutation, {
        fetchPolicy: 'no-cache',
        context: {
            headers: captchaHeaders
        }
    });

    const [fetchCartId] = useMutation(createCartMutation);
    const [mergeCarts] = useMutation(mergeCartsMutation);
    const fetchUserDetails = useAwaitQuery(getCustomerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const handleLoginTracking = useCallback(
        async type => {
            const userDetails = await fetchUserDetails();
            if (userDetails.data && userDetails.data.customer && userDetails.data.customer.id) {
                setUserData(userDetails.data.customer);
                trackUserLogin({
                    type: type || 'website',
                    userId: userDetails.data.customer.id
                });
            }
        },
        [fetchUserDetails, trackUserLogin, setUserData]
    );

    const handleSubmit = useCallback(
        async ({ email, password, rememberMe, token, type }) => {
            setIsSigningIn(true);
            try {
                await executeCaptchaValidation('sign_in');

                // Get source cart id (guest cart id).
                const sourceCartId = cartId;

                if (!token) {
                    // Sign in and set the token.
                    const signInResponse = await signIn({
                        variables: { email, password }
                    });
                    token = signInResponse.data.generateCustomerToken.token;
                }

                // Perist signin if "Remember me is selected" to 10 years
                await setToken(token, rememberMe ? 315360000 : undefined);

                // Clear all cart/customer data from cache and redux.
                await clearCartDataFromCache(apolloClient);
                await clearCustomerDataFromCache(apolloClient);
                await removeCart();

                // Create and get the customer's cart id.
                await createCart({
                    fetchCartId
                });
                const destinationCartId = await retrieveCartId();

                // Merge the guest cart into the customer cart.
                await mergeCarts({
                    variables: {
                        destinationCartId,
                        sourceCartId
                    }
                });

                await handleLoginTracking(type || 'website');

                // Ensure old stores are updated with any new data.
                getUserDetails({ fetchUserDetails });
                getCartDetails({ fetchCartId, fetchCartDetails });
                showAuthModal && setShowAuthModal(false);
            } catch (error) {
                if (ERROR_MESSAGES[error.message]) {
                    addToast({
                        type: ToastType.ERROR,
                        message: formatMessage({
                            id: ERROR_MESSAGES[error.message].translationId,
                            defaultMessage: Object.keys(ERROR_MESSAGES).find(
                                key => ERROR_MESSAGES[key] === ERROR_MESSAGES[error.message]
                            )
                        }),
                        link:
                            typeof ERROR_MESSAGES[error.message].link !== 'undefined'
                                ? ERROR_MESSAGES[error.message].link
                                : null,
                        timeout: false
                    });
                } else {
                    addToast({
                        type: ToastType.ERROR,
                        message: error.message,
                        timeout: false
                    });
                }
                setIsSigningIn(false);
            }
        },
        [
            executeCaptchaValidation,
            cartId,
            setToken,
            apolloClient,
            removeCart,
            createCart,
            fetchCartId,
            mergeCarts,
            handleLoginTracking,
            getUserDetails,
            fetchUserDetails,
            getCartDetails,
            fetchCartDetails,
            showAuthModal,
            setShowAuthModal,
            signIn,
            addToast,
            formatMessage
        ]
    );

    const handleForgotPassword = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showForgotPassword();
    }, [setDefaultUsername, showForgotPassword]);

    const handleCreateAccount = useCallback(() => {
        const { current: formApi } = formApiRef;

        if (formApi) {
            setDefaultUsername(formApi.getValue('email'));
        }

        showCreateAccount();
    }, [setDefaultUsername, showCreateAccount]);

    const errors = useMemo(() => new Map([['getUserDetailsQuery', getDetailsError], ['signInMutation', signInError]]), [
        getDetailsError,
        signInError
    ]);

    return {
        errors,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn,
        setFormApi
    };
};
