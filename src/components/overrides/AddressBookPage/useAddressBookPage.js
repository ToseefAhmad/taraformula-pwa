import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import defaultOperations from '@magento/peregrine/lib/talons/AddressBookPage/addressBookPage.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const DEFAULT_BILLING_SLUG = 'default-billing';
const DEFAULT_SHIPPING_SLUG = 'default-shipping';

/**
 *  A talon to support the functionality of the Address Book page.
 *
 *  @function
 *
 *  @param {Object} props
 *  @param {Object} props.operations - GraphQL operations to be run by the talon.
 *
 *  @returns {AddressBookPageTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useAddressBookPage } from '@magento/peregrine/lib/talons/AddressBookPage/useAddressBookPage';
 */
export const useAddressBookPage = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);
    const {
        createCustomerAddressMutation,
        deleteCustomerAddressMutation,
        getCustomerAddressesQuery,
        updateCustomerAddressMutation
    } = operations;

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

    const { data: customerAddressesData, loading } = useQuery(getCustomerAddressesQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !isSignedIn
    });

    const [deleteCustomerAddress, { loading: isDeletingCustomerAddress }] = useMutation(deleteCustomerAddressMutation);

    const [confirmDeleteAddressId, setConfirmDeleteAddressId] = useState();

    const isRefetching = !!customerAddressesData && loading;

    const customerAddresses = useMemo(() => {
        return (
            (customerAddressesData && customerAddressesData.customer && customerAddressesData.customer.addresses) || []
        );
    }, [customerAddressesData]);

    const [
        createCustomerAddress,
        { error: createCustomerAddressError, loading: isCreatingCustomerAddress }
    ] = useMutation(createCustomerAddressMutation);
    const [
        updateCustomerAddress,
        { error: updateCustomerAddressError, loading: isUpdatingCustomerAddress }
    ] = useMutation(updateCustomerAddressMutation);

    const [isDialogOpen, setIsDialogOpen] = useState(slug === DEFAULT_SHIPPING_SLUG);
    const [isDialogEditMode, setIsDialogEditMode] = useState(slug === DEFAULT_SHIPPING_SLUG);

    const [formAddress, setFormAddress] = useState(() => {
        switch (slug) {
            case DEFAULT_BILLING_SLUG:
                return customerAddresses.find(address => {
                    return !!address.default_billing;
                });
            case DEFAULT_SHIPPING_SLUG:
                return customerAddresses.find(address => {
                    return !!address.default_shipping;
                });
        }
        return {};
    });

    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170
    const [displayError, setDisplayError] = useState(false);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isRefetching);
    }, [isRefetching, setPageLoading]);

    // Open dialog if customer has no addresses.
    useEffect(() => {
        if (!customerAddresses.length && !loading) {
            setIsDialogOpen(true);
        }
    }, [customerAddresses, loading]);

    const handleAddAddress = useCallback(() => {
        // Hide all previous errors when we open the dialog.
        setDisplayError(false);
        setFormAddress({});
        setIsDialogEditMode(false);
        setIsDialogOpen(true);

        // Scroll page to the top
        window.scroll(0, 0);
    }, []);

    const handleDeleteAddress = useCallback(addressId => {
        setConfirmDeleteAddressId(addressId);
    }, []);

    const handleCancelDeleteAddress = useCallback(() => {
        setConfirmDeleteAddressId(null);
    }, []);

    const handleConfirmDeleteAddress = useCallback(async () => {
        try {
            await deleteCustomerAddress({
                variables: { addressId: confirmDeleteAddressId },
                refetchQueries: [{ query: getCustomerAddressesQuery }],
                awaitRefetchQueries: true
            });
            addToast({
                type: ToastType.SUCCESS,
                message: formatMessage({
                    id: 'addressBookPage.successDelete',
                    defaultMessage: 'Address has been deleted.'
                })
            });
            setConfirmDeleteAddressId(null);
        } catch (error) {
            addToast({
                type: ToastType.ERROR,
                message: error.message,
                timeout: false
            });
        }
    }, [addToast, confirmDeleteAddressId, deleteCustomerAddress, formatMessage, getCustomerAddressesQuery]);

    const handleEditAddress = useCallback(address => {
        // Hide all previous errors when we open the dialog.
        setDisplayError(false);

        setIsDialogEditMode(true);
        setFormAddress(address);
        setIsDialogOpen(true);

        // Scroll page to the top
        window.scroll(0, 0);
    }, []);

    const handleCancelDialog = useCallback(() => {
        setIsDialogEditMode(false);
        setFormAddress({});
        setIsDialogOpen(false);
    }, []);

    const handleConfirmDialog = useCallback(
        async formValues => {
            if (isDialogEditMode) {
                try {
                    await updateCustomerAddress({
                        variables: {
                            addressId: formAddress.id,
                            updated_address: {
                                ...formValues,
                                // Sends value as empty if none are provided
                                middlename: formValues.middlename || '',
                                // Cleans up the street array when values are null or undefined
                                street: formValues.street.filter(e => e)
                            }
                        },
                        refetchQueries: [{ query: getCustomerAddressesQuery }],
                        awaitRefetchQueries: true
                    });
                    addToast({
                        type: ToastType.SUCCESS,
                        message: formatMessage({
                            id: 'addressBookPage.successEdit',
                            defaultMessage: 'You updated the address.'
                        })
                    });
                    setIsDialogOpen(false);
                } catch (error) {
                    // Make sure any errors from the mutations are displayed.
                    addToast({
                        type: ToastType.ERROR,
                        message: error.message
                    });
                }
            } else {
                try {
                    await createCustomerAddress({
                        variables: {
                            address: {
                                ...formValues,
                                // Sends value as empty if none are provided
                                middlename: formValues.middlename || '',
                                // Cleans up the street array when values are null or undefined
                                street: formValues.street.filter(e => e)
                            }
                        },
                        refetchQueries: [{ query: getCustomerAddressesQuery }],
                        awaitRefetchQueries: true
                    });
                    addToast({
                        type: ToastType.SUCCESS,
                        message: formatMessage({
                            id: 'addressBookPage.successCreate',
                            defaultMessage: 'You saved the address.'
                        }),
                        timeout: 5000
                    });
                    setIsDialogOpen(false);
                } catch (error) {
                    // Make sure any errors from the mutations are displayed.
                    addToast({
                        type: ToastType.ERROR,
                        message: error.message
                    });
                }
            }
        },
        [
            addToast,
            createCustomerAddress,
            formAddress.id,
            formatMessage,
            getCustomerAddressesQuery,
            isDialogEditMode,
            updateCustomerAddress
        ]
    );

    const formErrors = useMemo(() => {
        if (displayError) {
            return new Map([
                ['createCustomerAddressMutation', createCustomerAddressError],
                ['updateCustomerAddressMutation', updateCustomerAddressError]
            ]);
        } else return new Map();
    }, [createCustomerAddressError, displayError, updateCustomerAddressError]);

    // Use data from backend until Intl.DisplayNames is widely supported
    const countryDisplayNameMap = useMemo(() => {
        const countryMap = new Map();

        if (customerAddressesData) {
            const { countries } = customerAddressesData;
            countries.forEach(country => {
                countryMap.set(country.id, country.full_name_locale);
            });
        }

        return countryMap;
    }, [customerAddressesData]);

    const isDialogBusy = isCreatingCustomerAddress || isUpdatingCustomerAddress;
    const isLoadingWithoutData = !customerAddressesData && loading;

    const formProps = {
        initialValues: formAddress
    };

    return {
        confirmDeleteAddressId,
        countryDisplayNameMap,
        customerAddresses,
        hasAddresses: !!customerAddresses.length,
        formErrors,
        formProps,
        handleAddAddress,
        handleCancelDeleteAddress,
        handleCancelDialog,
        handleConfirmDeleteAddress,
        handleConfirmDialog,
        handleDeleteAddress,
        handleEditAddress,
        isDeletingCustomerAddress,
        isDialogBusy,
        isDialogEditMode,
        isDialogOpen,
        isLoading: isLoadingWithoutData,
        isRefetching,
        slug
    };
};

/**
 * Object type returned by the {@link useAddressBookPage} talon.
 * It provides props data to use when rendering the address book page component.
 *
 * @typedef {Object} AddressBookPageTalonProps
 *
 * @property {String} confirmDeleteAddressId - The id of the address that is waiting to be confirmed for deletion.
 * @property {Map} countryDisplayNameMap - A Map of country id to its localized display name.
 * @property {Array<Object>} customerAddresses - A list of customer addresses.
 * @property {Map} formErrors - A Map of form errors.
 * @property {Object} formProps - Properties to pass to the add/edit form.
 * @property {Function} handleAddAdddress - Function to invoke when adding a new address.
 * @property {Function} handleCancelDeleteAddress - Function to deny the confirmation of deleting an address.
 * @property {Function} handleCancelDialog - Function to invoke when cancelling the add/edit dialog.
 * @property {Function} handleConfirmDeleteAddress - Function to invoke to accept the confirmation of deleting an address.
 * @property {Function} handleConfirmDialog - Function to invoke when submitting the add/edit dialog.
 * @property {Function} handleDeleteAddress - Function to invoke to begin the address deletion process.
 * @property {Function} handleEditAddress - Function to invoke when editing an existing address.
 * @property {Boolean} isDeletingCustomerAddress - Whether an address deletion is currently in progress.
 * @property {Boolean} isDialogBusy - Whether actions inside the dialog should be disabled.
 * @property {Boolean} isDialogEditMode - Whether the dialog is in edit mode (true) or add new mode (false).
 * @property {Boolean} isDialogOpen - Whether the dialog should be open.
 * @property {Boolean} isLoading - Whether the page is loading.
 */
