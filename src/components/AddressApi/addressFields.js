import { bool, func, object, oneOfType, string } from 'prop-types';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import Field from '@magento/venia-ui/lib/components/Field';
import Postcode from '@magento/venia-ui/lib/components/Postcode';
import Region from '@magento/venia-ui/lib/components/Region';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import AddressField from './addressField';
import { useAddressApi } from './useAddressApi';

const AddressFields = ({ className, countryCodeField, initialValues = {}, validate = null }) => {
    const { formatMessage } = useIntl();
    const countryFieldState = useFieldState(countryCodeField);
    const { value: country } = countryFieldState;
    const { countries, GetApiAddressFields } = useAddressApi();
    const selectedCountryId =
        countries &&
        countries.filter(apiCountry => apiCountry.key === country).map(filteredCountry => filteredCountry.value)[0];
    const addressFields = GetApiAddressFields(selectedCountryId);
    let addressFieldList = [];

    if (addressFields) {
        addressFieldList = addressFields.map((addrField, i) => (
            <AddressField
                key={i}
                className={className}
                validate={validate}
                initialValues={initialValues}
                {...addrField}
            />
        ));
    }

    const cityLabel = formatMessage({
        id: 'global.city',
        defaultMessage: 'City'
    });
    const streetLabel = formatMessage({
        id: 'global.streetAddress',
        defaultMessage: 'Street Address'
    });
    const apartmentLabel = formatMessage({
        id: 'global.apartment',
        defaultMessage: 'Apartment, suite, unit, etc.'
    });
    const zipLabel = formatMessage({
        id: 'global.zip',
        defaultMessage: 'Zip code'
    });

    const regionProps = {
        countryCodeField: countryCodeField,
        fieldInput: 'region[region]',
        fieldSelect: 'region[region_id]',
        optionValueKey: 'id',
        validate: validate
    };
    const cityProps = {
        field: 'city',
        validate: validate
    };
    const street1Props = {
        field: 'street[0]',
        validate: validate
    };
    const street2Props = {
        field: 'street[1]'
    };
    const postcodeProps = {
        label: zipLabel,
        validate: validate
    };

    if ('region' in initialValues) {
        regionProps.initialValue = initialValues.region;
    }

    if ('city' in initialValues) {
        cityProps.initialValue = initialValues.city;
    }

    if ('street1' in initialValues) {
        street1Props.initialValue = initialValues.street1;
    }

    if ('street2' in initialValues) {
        street2Props.initialValue = initialValues.street2;
    }

    if ('postcode' in initialValues) {
        postcodeProps.initialValue = initialValues.postcode;
    }

    const defaultFields = !addressFieldList.length && (
        <Fragment>
            <div className={className}>
                <Region {...regionProps} />
            </div>
            <div className={className}>
                <Field id="city" label={cityLabel} optional={false}>
                    <TextInput {...cityProps} />
                </Field>
            </div>
            <div className={className}>
                <Field id="street" label={streetLabel} optional={false}>
                    <TextInput {...street1Props} />
                </Field>
            </div>
            <div className={className}>
                <Field id="apartment" label={apartmentLabel} optional={true}>
                    <TextInput {...street2Props} />
                </Field>
            </div>
            <div className={className}>
                <Postcode {...postcodeProps} />
            </div>
        </Fragment>
    );

    return (
        <Fragment>
            {addressFieldList}
            {defaultFields}
        </Fragment>
    );
};

AddressFields.propTypes = {
    className: string,
    countryCodeField: string,
    initialValues: object,
    validate: oneOfType([func, bool])
};

export default AddressFields;
