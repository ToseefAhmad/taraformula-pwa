import { arrayOf, bool, func, shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { Trash2 as TrashIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import { useAddressApi } from '@app/components/AddressApi/useAddressApi';
import { ReplaceMappingValues } from '@app/util/address/replaceMappingValues';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';

import classes from './addressCard.module.css';

const AddressCard = ({
    address,
    countryName,
    isConfirmingDelete,
    isDeletingCustomerAddress,
    onCancelDelete,
    onConfirmDelete,
    onEdit,
    onDelete
}) => {
    const {
        city,
        country_code,
        default_shipping,
        firstname,
        lastname,
        postcode,
        region: { region },
        street,
        telephone,
        postal_code
    } = address;

    const { countries } = useAddressApi();
    const selectedCountry = countries.filter(apiCountry => apiCountry.key === country_code)[0];

    const { formatMessage } = useIntl();

    const confirmDeleteButtonClasses = {
        root_normalPriorityNegative: classes.confirmDeleteButton
    };
    const cancelDeleteButtonClasses = {
        root_lowPriority: classes.cancelDeleteButton
    };
    let streetRows = <dd>{street[1] ? `${street[0]} - ${street[1]}` : street[0]}</dd>;

    if (selectedCountry) {
        const addressLine1 = ReplaceMappingValues(selectedCountry.mapping.address_1, address);
        const addressLine2 = ReplaceMappingValues(selectedCountry.mapping.address_2, address);

        streetRows = (
            <Fragment>
                <dd>{addressLine1}</dd>
                <dd>{addressLine2}</dd>
            </Fragment>
        );
    }

    let defaultBadgeText;

    if (default_shipping) {
        defaultBadgeText = formatMessage({
            id: 'addressCard.defaultShipping',
            defaultMessage: 'Default shipping address'
        });
    }

    const defaultBadge = defaultBadgeText && <span className={classes.defaultBadge}>{defaultBadgeText}</span>;

    const nameString = [firstname, lastname].filter(name => !!name).join(' ');
    const regionValue = region ? `, ${region}` : '';
    let postcodeValue = '';

    if (postcode) {
        postcodeValue = `, ${postcode}`;
    } else if (postal_code) {
        postcodeValue = `, ${postal_code}`;
    }

    const additionalAddressString = `${city}${regionValue}${postcodeValue}`;

    const deleteButtonElement = !default_shipping && (
        <LinkButton classes={{ root: classes.deleteButton }} onClick={onDelete}>
            <Icon classes={{ icon: null }} size={20} src={TrashIcon} />
        </LinkButton>
    );

    const maybeConfirmingDeleteOverlay = isConfirmingDelete && (
        <div className={classes.confirmDeleteContainer}>
            <Button
                classes={confirmDeleteButtonClasses}
                disabled={isDeletingCustomerAddress}
                priority="normal"
                type="button"
                negative={true}
                onClick={onConfirmDelete}
            >
                <FormattedMessage id={'global.delete'} defaultMessage={'Delete'} />
            </Button>
            <Button
                classes={cancelDeleteButtonClasses}
                disabled={isDeletingCustomerAddress}
                priority="low"
                type="button"
                onClick={onCancelDelete}
            >
                <FormattedMessage id={'global.cancel'} defaultMessage={'Cancel'} />
            </Button>
        </div>
    );

    return (
        <div className={default_shipping ? classes.root : classes.rootAdditional}>
            {defaultBadge}
            <dl className={classes.contentContainer}>
                <dd>{nameString}</dd>
                {streetRows}
                <dd>{additionalAddressString}</dd>
                <dd>{countryName || country_code}</dd>
                <dd className={classes.telephone}>{telephone}</dd>
            </dl>
            <div className={classes.actionContainer}>
                <Button onClick={onEdit} priority="secondary" fill="outline">
                    <span className={classes.actionLabel}>
                        <FormattedMessage id="addressCard.editAddress" defaultMessage="Edit Address" />
                    </span>
                </Button>
                {maybeConfirmingDeleteOverlay}
            </div>
            {deleteButtonElement}
        </div>
    );
};

export default AddressCard;

AddressCard.propTypes = {
    address: shape({
        city: string,
        country_code: string,
        default_shipping: bool,
        default_billing: bool,
        firstname: string,
        lastname: string,
        postcode: string,
        region: shape({
            region_code: string,
            region: string
        }),
        street: arrayOf(string),
        telephone: string,
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
    countryName: string,
    isConfirmingDelete: bool,
    isDeletingCustomerAddress: bool,
    onCancelDelete: func,
    onConfirmDelete: func,
    onDelete: func,
    onEdit: func
};
