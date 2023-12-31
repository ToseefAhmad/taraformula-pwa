import { useMutation } from '@apollo/client';
import { useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { ToastType, useToasts } from '@app/hooks/useToasts';

/**
 * Returns props necessary to render a ResetPassword form.
 *
 * @param {function} props.mutations - mutation to call when the user submits the new password.
 *
 * @returns {ResetPasswordProps} - GraphQL mutations for the reset password form.
 */
export const useResetPassword = props => {
    const { mutations } = props;

    const [hasCompleted, setHasCompleted] = useState(false);
    const location = useLocation();
    const [resetPassword, { loading }] = useMutation(mutations.resetPasswordMutation);

    const searchParams = useMemo(() => new URLSearchParams(location.search), [location]);
    const token = searchParams.get('token');

    const [, { addToast }] = useToasts();

    const handleSubmit = useCallback(
        async ({ email, newPassword }) => {
            try {
                if (email && token && newPassword) {
                    await resetPassword({
                        variables: { email, token, newPassword }
                    });

                    setHasCompleted(true);
                }
            } catch (err) {
                setHasCompleted(false);

                addToast({
                    type: ToastType.ERROR,
                    message: err.message,
                    timeout: 5000
                });
            }
        },
        [resetPassword, token, addToast]
    );

    return {
        handleSubmit,
        hasCompleted,
        loading,
        token
    };
};

/** JSDocs type definitions */

/**
 * GraphQL mutations for the reset password form.
 * This is a type used by the {@link useResetPassword} talon.
 *
 * @typedef {Object} ResetPasswordMutations
 *
 * @property {GraphQLAST} resetPasswordMutation mutation for resetting password
 *
 * @see [resetPassword.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/MyAccount/ResetPassword/resetPassword.gql.js}
 * for the query used in Venia
 */

/**
 * Object type returned by the {@link useResetPassword} talon.
 * It provides props data to use when rendering the reset password form component.
 *
 * @typedef {Object} ResetPasswordProps
 *
 * @property {Array} formErrors A list of form errors
 * @property {Function} handleSubmit Callback function to handle form submission
 * @property {Boolean} hasCompleted True if password reset mutation has completed. False otherwise
 * @property {Boolean} loading True if password reset mutation is in progress. False otherwise
 * @property {String} token token needed for password reset, will be sent in the mutation
 */
