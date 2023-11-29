import { number, string } from 'prop-types';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import { ThinPlus } from '@app/components/Icons';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useStores } from '@app/hooks/useStores/useStores';
import StripeContextProvider from '@app/talons/Stripe/stripeContextProvider';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAddressBookPage } from '@magento/peregrine/lib/talons/AddressBookPage/useAddressBookPage';
import AddEditDialog from '@magento/venia-ui/lib/components/AddressBookPage/addEditDialog';
import AddressCard from '@magento/venia-ui/lib/components/AddressBookPage/addressCard';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import AuthRoute from '@magento/venia-ui/lib/components/Routes/authRoute';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './addressBookPage.module.css';

const AddressBookPage = () => {
    const {
        confirmDeleteAddressId,
        countryDisplayNameMap,
        customerAddresses,
        hasAddresses,
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
        isLoading,
        isRefetching,
        slug
    } = useAddressBookPage();

    const { formatMessage } = useIntl();
    const { isMiniTabletScreen, isTrueMobileScreen } = useScreenSize();
    const { currentStoreCode } = useStores();
    const [{ isSignedIn }] = useUserContext();

    if (slug) {
        history.replaceState(null, null, `/${currentStoreCode}/address-book`);
    }

    const defaultAddresses = useMemo(() => {
        return customerAddresses.filter(address => address.default_shipping);
    }, [customerAddresses]);

    const additionalAddresses = useMemo(() => {
        return customerAddresses.filter(address => !address.default_shipping);
    }, [customerAddresses]);

    if (!isSignedIn) {
        return <AuthRoute redirectTo="/sign-in" />;
    }

    const defaultAddressCards = defaultAddresses.map((address, i) => {
        const countryName = countryDisplayNameMap.get(address.country_code);
        const boundEdit = () => handleEditAddress(address);

        return isRefetching ? (
            <Shimmer key={i} width="100%" height="290px" />
        ) : (
            <AddressCard
                address={address}
                countryName={countryName}
                isDeletingCustomerAddress={isDeletingCustomerAddress}
                key={address.id}
                onCancelDelete={handleCancelDeleteAddress}
                onConfirmDelete={handleConfirmDeleteAddress}
                onEdit={boundEdit}
                isLoading={isLoading}
                isRefetching={isRefetching}
            />
        );
    });

    const additionalAddressCards = additionalAddresses.map(address => {
        const countryName = countryDisplayNameMap.get(address.country_code);
        const boundEdit = () => handleEditAddress(address);
        const boundDelete = () => handleDeleteAddress(address.id);
        const isConfirmingDelete = confirmDeleteAddressId === address.id;

        return isRefetching ? (
            <Shimmer width="100%" height="247px" />
        ) : (
            <AddressCard
                address={address}
                countryName={countryName}
                isConfirmingDelete={isConfirmingDelete}
                isDeletingCustomerAddress={isDeletingCustomerAddress}
                key={address.id}
                onCancelDelete={handleCancelDeleteAddress}
                onConfirmDelete={handleConfirmDeleteAddress}
                onDelete={boundDelete}
                onEdit={boundEdit}
                isLoading={isLoading}
                isRefetching={isRefetching}
            />
        );
    });

    const addAddressText = (
        <FormattedMessage id={'addressBookPage.addNewAddressText'} defaultMessage={'Add New Address'} />
    );

    const defaultAddressTitle = !isRefetching ? (
        <h4 className={classes.title}>
            <FormattedMessage id={'addressBookPage.contentTitle'} defaultMessage={'Address book'} />
        </h4>
    ) : (
        <Shimmer width="200px" height="32px" classes={{ root_rectangle: classes.defaultTitleShimmer }} />
    );

    const additionalAddressTitle = !isRefetching ? (
        <h4 className={classes.additionalTitle}>
            <FormattedMessage
                id={'addressBookPage.additionalContentTitle'}
                defaultMessage={'Additional address entries'}
            />
        </h4>
    ) : (
        <Shimmer width="200px" height="32px" classes={{ root_rectangle: classes.additionalTitleShimmer }} />
    );

    const addAddressLink = !isRefetching ? (
        <LinkButton className={classes.addButtonLink} onClick={handleAddAddress}>
            {addAddressText}
        </LinkButton>
    ) : (
        <Shimmer width="152px" height="24px" classes={{ root_rectangle: classes.defaultTitleShimmer }} />
    );

    const addAddressButton = !isRefetching ? (
        <LinkButton className={classes.addButton} key="addAddressButton" onClick={handleAddAddress}>
            <div className={classes.addButtonContent}>
                <Icon classes={{ root: classes.addButtonIcon }} src={ThinPlus} />
                <span className={classes.addText}>{addAddressText}</span>
            </div>
        </LinkButton>
    ) : (
        <Shimmer width="100%" classes={{ root_rectangle: classes.addAddressShimmer }} />
    );

    let pageTitle;
    if (isDialogEditMode && isDialogOpen) {
        pageTitle = formatMessage({
            id: 'addressBookPage.editAddressTitle',
            defaultMessage: 'Edit Address'
        });
    } else if (isDialogOpen) {
        pageTitle = formatMessage({
            id: 'addressBookPage.addAddressTitle',
            defaultMessage: 'Add Address'
        });
    } else {
        pageTitle = formatMessage({
            id: 'addressBookPage.defaultTitle',
            defaultMessage: 'Address Book'
        });
    }

    return (
        <StripeContextProvider>
            <AccountPageWrapper pageTitle={pageTitle} path={'/address-book'}>
                {!isDialogOpen ? (
                    <div className={classes.root}>
                        <div className={classes.header}>
                            {defaultAddressTitle}
                            {(defaultAddresses.length >= 2 || isMiniTabletScreen) && addAddressLink}
                        </div>
                        <div className={classes.content}>
                            {defaultAddressCards}
                            {((defaultAddresses.length < 2 && !isMiniTabletScreen) || isTrueMobileScreen) &&
                                addAddressButton}
                        </div>
                        {!!additionalAddresses.length && additionalAddressTitle}
                        <div className={classes.additionalContent}>{additionalAddressCards}</div>
                    </div>
                ) : (
                    <AddEditDialog
                        formErrors={formErrors}
                        formProps={formProps}
                        isBusy={isDialogBusy}
                        isEditMode={isDialogEditMode}
                        isOpen={isDialogOpen}
                        onCancel={handleCancelDialog}
                        onConfirm={handleConfirmDialog}
                        hasAddresses={hasAddresses}
                    />
                )}
            </AccountPageWrapper>
        </StripeContextProvider>
    );
};

AddressBookPage.propTypes = {
    identifier: string,
    id: number
};

export default AddressBookPage;
