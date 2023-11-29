import { shape, string, bool, func, arrayOf } from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { Check as CheckIcon } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import { useAddressApi } from '@app/components/AddressApi/useAddressApi';
import { ReplaceMappingValues } from '@app/util/address/replaceMappingValues';
import { useAddressCard } from '@magento/peregrine/lib/talons/CheckoutPage/AddressBook/useAddressCard';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';

import defaultClasses from './addressCard.module.css';

const AddressCard = props => {
    const { address, classes: propClasses, isSelected, onEdit, onSelection, forceOpenAndValidate } = props;

    const talonProps = useAddressCard({
        address,
        onEdit,
        onSelection
    });
    const { handleClick, handleEditAddress, handleKeyPress, hasUpdate } = talonProps;

    const {
        city,
        country_code,
        default_shipping,
        firstname,
        lastname,
        postcode,
        region: { region },
        street,
        postal_code,
        telephone
    } = address;

    const { countries } = useAddressApi();
    const selectedCountry = countries.filter(apiCountry => apiCountry.key === country_code)[0];

    let streetRows = street.map((row, index) => {
        return <span key={index}>{row}</span>;
    });

    if (selectedCountry) {
        const addressLine1 = ReplaceMappingValues(selectedCountry.mapping.address_1, address);
        const addressLine2 = ReplaceMappingValues(selectedCountry.mapping.address_2, address);

        streetRows = (
            <Fragment>
                <span>{addressLine1}</span>
                <span>{addressLine2}</span>
            </Fragment>
        );
    }

    const classes = useStyle(defaultClasses, propClasses);

    const rootClass = isSelected ? (hasUpdate ? classes.root_updated : classes.root_selected) : classes.root;

    const countryName = country_code;

    useEffect(() => {
        if (forceOpenAndValidate) {
            handleEditAddress();
        }
    }, [forceOpenAndValidate, handleEditAddress]);

    const editButton = isSelected ? (
        <div className={classes.buttonContainer}>
            <Button type="button" priority="secondary" fill="outline" onClick={handleEditAddress}>
                <FormattedMessage id={'global.editAddressButton'} defaultMessage={'Edit Address'} />
            </Button>
        </div>
    ) : null;

    const selectedAddressCheckmark = isSelected ? (
        <span className={classes.checkmarkIcon}>
            <CheckIcon width={16} />
        </span>
    ) : null;

    const defaultBadge = (
        <span className={classes.defaultBadge}>
            {default_shipping ? (
                <FormattedMessage id={'addressCard.defaultShipping'} defaultMessage={'Default shipping address'} />
            ) : (
                <FormattedMessage id={'addressCard.shippingAddress'} defaultMessage={'Shipping address'} />
            )}
        </span>
    );

    const regionName = region ? `, ${region}` : '';
    const nameString = `${firstname} ${lastname}`;
    let postcodeValue = '';

    if (postcode) {
        postcodeValue = ` ${postcode}`;
    } else if (postal_code) {
        postcodeValue = ` ${postal_code}`;
    }

    const additionalAddressString = `${city}${regionName}${postcodeValue}`;

    return (
        <div className={rootClass} onClick={handleClick} onKeyPress={handleKeyPress} role="button" tabIndex="0">
            {selectedAddressCheckmark}
            {defaultBadge}
            <span>{nameString}</span>
            {streetRows}
            <span>{additionalAddressString}</span>
            <span>{countryName}</span>
            <span className={classes.telephone}>{telephone}</span>
            {editButton}
        </div>
    );
};

export default AddressCard;

AddressCard.propTypes = {
    address: shape({
        city: string,
        country_code: string,
        default_shipping: bool,
        firstname: string,
        lastname: string,
        postcode: string,
        region: shape({
            region_code: string,
            region: string
        }),
        street: arrayOf(string),
        area: string,
        block: string,
        neighborhood: string,
        zone: string,
        avenue: string,
        house_building: string,
        floor: string,
        building: string,
        flat: string,
        postal_code: string,
        additional_numbers: string,
        id_number: string
    }).isRequired,
    classes: shape({
        root: string,
        root_selected: string,
        root_updated: string,
        editButton: string,
        editIcon: string,
        defaultBadge: string,
        name: string,
        address: string
    }),
    isSelected: bool.isRequired,
    onEdit: func.isRequired,
    onSelection: func.isRequired,
    forceOpenAndValidate: bool
};
