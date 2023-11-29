import { useApolloClient, useMutation } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

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
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql.js';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

/**
 * Returns props necessary to render CreateAccount component. In particular this
 * talon handles the submission flow by first doing a pre-submisson validation
 * and then, on success, invokes the `onSubmit` prop, which is usually the action.
 *
 * @param {CreateAccountQueries} props.queries queries used by the talon
 * @param {CreateAccountMutations} props.mutations mutations used by the talon
 * @param {InitialValues} props.initialValues initial values to sanitize and seed the form
 * @param {Function} props.onSubmit the post submit callback
 * @param {Function} props.onCancel the cancel callback
 *
 * @returns {CreateAccountProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useForgotPassword } from '@magento/peregrine/lib/talons/CreateAccount/useCreateAccount.js';
 */
export const useCreateAccount = props => {
    const { initialValues = {}, onSubmit, onCancel, lastOrderAssign = false } = props;
    const { trackUserRegister } = useTracking();
    const [
        { showAuthModal },
        {
            actions: { setShowAuthModal }
        }
    ] = useAppContext();

    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const {
        captchaHeaders: captchaHeadersCreateAccount,
        executeCaptchaValidation: executeCaptchaValidationCreateAccount
    } = useCaptcha();
    const {
        captchaHeaders: captchaHeadersSignIn,
        executeCaptchaValidation: executeCaptchaValidationSignIn
    } = useCaptcha();

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        createAccountMutation,
        createCartMutation,
        getCartDetailsQuery,
        getCustomerQuery,
        mergeCartsMutation,
        signInMutation
    } = operations;
    const apolloClient = useApolloClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [{ cartId }, { createCart, removeCart, getCartDetails }] = useCartContext();
    const [{ isGettingDetails }, { getUserDetails, setToken }] = useUserContext();

    const [fetchCartId] = useMutation(createCartMutation);

    const [mergeCarts] = useMutation(mergeCartsMutation);

    // For create account and sign in mutations, we don't want to cache any
    // Personally identifiable information (PII). So we set fetchPolicy to 'no-cache'.
    const [createAccount, { error: createAccountError }] = useMutation(createAccountMutation, {
        fetchPolicy: 'no-cache',
        context: {
            headers: captchaHeadersCreateAccount
        }
    });

    const [signIn, { error: signInError }] = useMutation(signInMutation, {
        fetchPolicy: 'no-cache',
        context: {
            headers: captchaHeadersSignIn
        }
    });

    const fetchUserDetails = useAwaitQuery(getCustomerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const handleSubmit = useCallback(
        async formValues => {
            setIsSubmitting(true);
            try {
                await executeCaptchaValidationCreateAccount('create_account');

                // Get source cart id (guest cart id).
                const sourceCartId = cartId;

                const variables = {
                    email: formValues.customer.email,
                    firstname: formValues.customer.firstname,
                    lastname: formValues.customer.lastname,
                    password: formValues.password,
                    is_subscribed: !!formValues.subscribe,
                    last_order_assign: lastOrderAssign
                };

                if (formValues.customer.gender) {
                    variables.gender = formValues.customer.gender;
                }

                if (formValues.customer.date_of_birth) {
                    const dob = formValues.customer.date_of_birth;
                    variables.date_of_birth = `${dob.year}-${dob.month
                        .toString()
                        .padStart(2, '0')}-${dob.day.toString().padStart(2, '0')}`;
                }

                // Create the account and then sign in.
                const customer = await createAccount({
                    variables: variables
                });

                await executeCaptchaValidationSignIn('sign_in');

                const signInResponse = await signIn({
                    variables: {
                        email: formValues.customer.email,
                        password: formValues.password
                    }
                });
                trackUserRegister({
                    email: formValues.customer.email,
                    id: customer.data.createCustomer.id
                });
                addToast({
                    type: ToastType.SUCCESS,
                    message: formatMessage({
                        id: 'createAccount.successMsg',
                        defaultMessage: 'Thank you for registering with Tara'
                    })
                });

                const token = signInResponse.data.generateCustomerToken.token;
                await setToken(token);

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

                // Ensure old stores are updated with any new data.
                await getUserDetails({ fetchUserDetails });
                await getCartDetails({
                    fetchCartId,
                    fetchCartDetails
                });

                // Finally, invoke the post-submission callback.
                if (onSubmit) {
                    onSubmit();
                }

                showAuthModal && setShowAuthModal(false);
            } catch (error) {
                const existingCustomerError =
                    'A customer with the same email address already exists in an associated website.';

                if (error.message === existingCustomerError) {
                    addToast({
                        type: ToastType.ERROR,
                        message: formatMessage({
                            id: 'createAccount.existingCustomer',
                            defaultMessage: 'This email address is already registered'
                        }),
                        timeout: false,
                        link: {
                            url: '/forgot-password',
                            text: 'Reset password'
                        }
                    });
                } else {
                    addToast({
                        type: ToastType.ERROR,
                        message: error.message,
                        timeout: false
                    });
                }

                setIsSubmitting(false);
            }
        },
        [
            cartId,
            createAccount,
            signIn,
            setToken,
            apolloClient,
            removeCart,
            createCart,
            fetchCartId,
            mergeCarts,
            getUserDetails,
            fetchUserDetails,
            getCartDetails,
            fetchCartDetails,
            addToast,
            formatMessage,
            trackUserRegister,
            onSubmit,
            setShowAuthModal,
            showAuthModal,
            executeCaptchaValidationCreateAccount,
            executeCaptchaValidationSignIn,
            lastOrderAssign
        ]
    );

    const sanitizedInitialValues = useMemo(() => {
        const { email, firstName, lastName, ...rest } = initialValues;

        return {
            customer: { email, firstname: firstName, lastname: lastName },
            ...rest
        };
    }, [initialValues]);

    const errors = useMemo(
        () => new Map([['createAccountQuery', createAccountError], ['signInMutation', signInError]]),
        [createAccountError, signInError]
    );

    return {
        errors,
        handleCancel,
        handleSubmit,
        initialValues: sanitizedInitialValues,
        isDisabled: isSubmitting || isGettingDetails
    };
};

/** JSDocs type definitions */

/**
 * GraphQL queries for the create account form.
 * This is a type used by the {@link useCreateAccount} talon.
 *
 * @typedef {Object} CreateAccountQueries
 *
 * @property {GraphQLAST} customerQuery query to fetch customer details
 * @property {GraphQLAST} getCartDetailsQuery query to get cart details
 */

/**
 * GraphQL mutations for the create account form.
 * This is a type used by the {@link useCreateAccount} talon.
 *
 * @typedef {Object} CreateAccountMutations
 *
 * @property {GraphQLAST} createAccountMutation mutation for creating new account
 * @property {GraphQLAST} createCartMutation mutation for creating new cart
 * @property {GraphQLAST} mergeCartsMutation mutation for merging carts
 * @property {GraphQLAST} signInMutation mutation for signing
 */

/**
 * Initial values for the create account form.
 * This is a type used by the {@link useCreateAccount} talon.
 *
 * @typedef {Object} InitialValues
 *
 * @property {String} email email id of the user
 * @property {String} firstName first name of the user
 * @property {String} lastName last name of the user
 */

/**
 * Sanitized initial values for the create account form.
 * This is a type used by the {@link useCreateAccount} talon.
 *
 * @typedef {Object} SanitizedInitialValues
 *
 * @property {String} email email id of the user
 * @property {String} firstname first name of the user
 * @property {String} lastname last name of the user
 */

/**
 * Object type returned by the {@link useCreateAccount} talon.
 * It provides props data to use when rendering the create account form component.
 *
 * @typedef {Object} CreateAccountProps
 *
 * @property {Map} errors a map of errors to their respective mutations
 * @property {Function} handleCancel callback function to handle form cancellations
 * @property {Function} handleSubmit callback function to handle form submission
 * @property {SanitizedInitialValues} initialValues initial values for the create account form
 * @property {Boolean} isDisabled true if either details are being fetched or form is being submitted. False otherwise.
 */
