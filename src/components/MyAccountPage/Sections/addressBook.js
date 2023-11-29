import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { useAddressBookPage } from '@magento/peregrine/lib/talons/AddressBookPage/useAddressBookPage';
import AddressCard from '@magento/venia-ui/lib/components/AddressBookPage/addressCard';
import Link from '@magento/venia-ui/lib/components/Link';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './myAccountSection.module.css';

const AddressBook = () => {
    const { countryDisplayNameMap, customerAddresses, isRefetching } = useAddressBookPage();

    const history = useHistory();

    const defaultAddresses = useMemo(() => {
        return customerAddresses.filter(address => address.default_shipping || address.default_billing);
    }, [customerAddresses]);

    const defaultAddressCards = defaultAddresses.map((address, i) => {
        if (address.default_billing && !address.default_shipping) return;
        const countryName = countryDisplayNameMap.get(address.country_code);
        const boundEdit = () => {
            history.push('/address-book/default-shipping');
        };

        return isRefetching ? (
            <Shimmer width="100%" height="290px" key={i} />
        ) : (
            <AddressCard address={address} countryName={countryName} key={address.id} onEdit={boundEdit} />
        );
    });

    if (typeof customerAddresses === 'undefined') {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'addressBook.loadingInformation'} defaultMessage={'Fetching addresses'} />
            </LoadingIndicator>
        );
    }

    return customerAddresses.length ? (
        <div className={classes.root}>
            <div className={classes.heading}>
                <h4 className={classes.title}>
                    <FormattedMessage id={'addressBookPage.defaultTitle'} defaultMessage={'Address Book'} />
                </h4>
                <Link className={classes.link} to={'/address-book'}>
                    <FormattedMessage id={'addressBook.sectionTitleText'} defaultMessage={'Manage Addresses'} />
                </Link>
            </div>
            <div className={classes.content}>{defaultAddressCards}</div>
        </div>
    ) : null;
};

export default AddressBook;
