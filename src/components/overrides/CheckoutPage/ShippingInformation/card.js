import { arrayOf, shape, string } from 'prop-types';
import React, { Fragment } from 'react';

import { useAddressApi } from '@app/components/AddressApi/useAddressApi';
import { ReplaceMappingValues } from '@app/util/address/replaceMappingValues';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './card.module.css';

const Card = props => {
    const { classes: propClasses, shippingData } = props;
    const {
        city,
        country: { label: country },
        email,
        firstname,
        lastname,
        postcode,
        region: { region },
        street,
        telephone,
        postal_code
    } = shippingData;

    const { countries } = useAddressApi();

    const selectedCountry = countries && countries.filter(apiCountry => apiCountry.key === country)[0];

    let streetRows = street.map((row, index) => {
        return <span key={index}>{row}</span>;
    });

    if (selectedCountry) {
        const addressLine1 = ReplaceMappingValues(selectedCountry.mapping.address_1, shippingData);
        const addressLine2 = ReplaceMappingValues(selectedCountry.mapping.address_2, shippingData);

        streetRows = (
            <Fragment>
                <span>{addressLine1}</span>
                <span>{addressLine2}</span>
            </Fragment>
        );
    }

    const classes = useStyle(defaultClasses, propClasses);

    const countryName = country;
    const regionName = region ? `, ${region}` : '';
    const nameString = `${firstname} ${lastname}`;
    let postcodeValue = '';

    if (postcode) {
        postcodeValue = ` ${postcode}`;
    } else if (postal_code) {
        postcodeValue = ` ${postal_code}`;
    }

    const additionalAddressString = `${city}${regionName}${postcodeValue} ${countryName}`;

    return (
        <div className={classes.root}>
            <span>{email}</span>
            <span>{nameString}</span>
            <span className={classes.telephone}>{telephone}</span>
            <div className={classes.address}>
                {streetRows}
                <span>{additionalAddressString}</span>
            </div>
        </div>
    );
};

export default Card;

Card.propTypes = {
    classes: shape({
        root: string,
        address: string,
        area: string
    }),
    shippingData: shape({
        city: string.isRequired,
        country: shape({
            label: string.isRequired
        }).isRequired,
        email: string.isRequired,
        firstname: string.isRequired,
        lastname: string.isRequired,
        postcode: string,
        region: shape({
            region: string
        }),
        street: arrayOf(string),
        telephone: string.isRequired,
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
    })
};
