import { arrayOf, shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { useAddressApi } from '@app/components/AddressApi/useAddressApi';
import { ReplaceMappingValues } from '@app/util/address/replaceMappingValues';

import classes from './billingInformation.module.css';

const BillingInformation = ({ data }) => {
    const { city, country_code, firstname, lastname, postcode, region, street, telephone, postal_code } = data;

    const { countries } = useAddressApi();
    const selectedCountry = countries.filter(apiCountry => apiCountry.key === country_code)[0];

    const nameString = [firstname, lastname].filter(name => !!name).join(' ');
    const regionValue = region ? `, ${region}` : '';
    let postcodeValue = '';

    if (postcode) {
        postcodeValue = `, ${postcode}`;
    } else if (postal_code) {
        postcodeValue = `, ${postal_code}`;
    }

    const additionalAddressString = `${city}${regionValue}${postcodeValue}`;

    let streetRows = <dd>{street[1] ? `${street[0]} - ${street[1]}` : street[0]}</dd>;

    if (selectedCountry) {
        const addressLine1 = ReplaceMappingValues(selectedCountry.mapping.address_1, data);
        const addressLine2 = ReplaceMappingValues(selectedCountry.mapping.address_2, data);

        streetRows = (
            <Fragment>
                <dd>{addressLine1}</dd>
                <dd>{addressLine2}</dd>
            </Fragment>
        );
    }

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <FormattedMessage id="orderDetails.billingInformationLabel" defaultMessage="Billing Information" />
            </div>
            <dl className={classes.content}>
                <dd>{nameString}</dd>
                {streetRows}
                <dd>{additionalAddressString}</dd>
                <dd>{country_code}</dd>
                <dd className={classes.telephone}>{telephone}</dd>
            </dl>
        </div>
    );
};

export default BillingInformation;

BillingInformation.propTypes = {
    data: shape({
        city: string,
        country_code: string,
        firstname: string,
        lastname: string,
        postcode: string,
        region: string,
        street: arrayOf(string),
        area: string,
        block: string,
        neighborhood: string,
        avenue: string,
        house_building: string,
        floor: string,
        building: string,
        flat: string,
        postal_code: string,
        additional_numbers: string,
        id_number: string
    })
};
