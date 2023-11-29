import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const CHANGE_PASSWORD = 'change-password';

export const useAccountInformationPage = ({
    mutations: { setCustomerInformationMutation, changeCustomerPasswordMutation },
    queries: { getCustomerInformationQuery }
}) => {
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const { slug } = useParams();

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const [{ isSignedIn }] = useUserContext();
    const [shouldShowNewPassword, setShouldShowNewPassword] = useState(() => {
        return slug === CHANGE_PASSWORD;
    });
    const [shouldRequestPassword, setShouldRequestPassword] = useState(false);
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170
    const [displayError, setDisplayError] = useState(false);

    const { data: accountInformationData, error: loadDataError, loading } = useQuery(getCustomerInformationQuery, {
        skip: !isSignedIn,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [
        setCustomerInformation,
        { error: customerInformationUpdateError, loading: isUpdatingCustomerInformation }
    ] = useMutation(setCustomerInformationMutation);

    const [
        changeCustomerPassword,
        { error: customerPasswordChangeError, loading: isChangingCustomerPassword }
    ] = useMutation(changeCustomerPasswordMutation);

    const isRefetching = !!accountInformationData && loading;

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isRefetching);
    }, [isRefetching, setPageLoading]);

    const initialValues = useMemo(() => {
        if (accountInformationData) {
            return { customer: accountInformationData.customer };
        }
    }, [accountInformationData]);

    const handleChangePassword = useCallback(() => {
        setShouldShowNewPassword(true);
    }, [setShouldShowNewPassword]);

    const handleCancelChangePassword = useCallback(() => {
        setShouldShowNewPassword(false);
    }, [setShouldShowNewPassword]);

    const handleCancel = useCallback(() => {
        setIsUpdateMode(false);
        setShouldShowNewPassword(false);
        setShouldRequestPassword(false);
    }, [setIsUpdateMode]);

    const showUpdateMode = useCallback(() => {
        setIsUpdateMode(true);

        // If there were errors from removing/updating info, hide them
        // When we open the modal.
        setDisplayError(false);
    }, [setIsUpdateMode]);

    const handleEmailChange = useCallback(
        ({ target }) => {
            setShouldRequestPassword(initialValues.customer.email !== target.value);
        },
        [setShouldRequestPassword, initialValues]
    );

    const handleSubmit = useCallback(
        async ({ email, firstname, lastname, password, newPassword, gender, date_of_birth }) => {
            try {
                email = email.trim();
                firstname = firstname.trim();
                lastname = lastname.trim();
                password = password ? password.trim() : password;
                newPassword = newPassword ? newPassword.trim() : newPassword;
                date_of_birth = `${date_of_birth.year}-${date_of_birth.month
                    .toString()
                    .padStart(2, '0')}-${date_of_birth.day.toString().padStart(2, '0')}`;

                if (
                    initialValues.customer.email !== email ||
                    initialValues.customer.firstname !== firstname ||
                    initialValues.customer.lastname !== lastname ||
                    initialValues.customer.gender !== gender ||
                    initialValues.customer.date_of_birth !== date_of_birth
                ) {
                    await setCustomerInformation({
                        variables: {
                            customerInput: {
                                email,
                                firstname,
                                lastname,
                                gender,
                                date_of_birth,
                                // You must send password because it is required
                                // When changing email.
                                password
                            }
                        }
                    });
                }
                if (password && newPassword) {
                    await changeCustomerPassword({
                        variables: {
                            currentPassword: password,
                            newPassword: newPassword
                        }
                    });
                }
                setShouldRequestPassword(false);
                addToast({
                    type: ToastType.SUCCESS,
                    message: formatMessage({
                        id: 'accountInformationPage.saveSuccess',
                        defaultMessage: 'You saved the account information.'
                    })
                });

                // After submission, close the form if there were no errors.
                handleCancel(false);
            } catch (error) {
                // Make sure any errors from the mutation are displayed.
                addToast({
                    type: ToastType.ERROR,
                    message: error.message,
                    timeout: false
                });
                return;
            }
        },
        [initialValues, addToast, formatMessage, handleCancel, setCustomerInformation, changeCustomerPassword]
    );

    const errors = displayError ? [customerInformationUpdateError, customerPasswordChangeError] : [];

    return {
        handleCancel,
        formErrors: errors,
        handleSubmit,
        handleEmailChange,
        handleChangePassword,
        handleCancelChangePassword,
        initialValues,
        isDisabled: isUpdatingCustomerInformation || isChangingCustomerPassword,
        isUpdateMode,
        loadDataError,
        shouldShowNewPassword,
        shouldRequestPassword,
        showUpdateMode,
        slug
    };
};
