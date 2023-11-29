import { useFormApi } from 'informed';
import { head } from 'lodash';
import { func, string } from 'prop-types';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import { GET_ALLOWED_COUNTRIES_QUERY } from '@app/components/overrides/Country/allowedCountries.gql';
import ReactSelect from '@app/components/ReactSelect';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import classes from '@magento/venia-ui/lib/components/Country/country.module.css';

import { useCountry } from './useCountry';

const Country = ({ field, initialValue, validate = null }) => {
    const { formatMessage } = useIntl();
    const formApi = useFormApi();
    const { countries, loading } = useCountry({
        queries: {
            getCountriesQuery: GET_ALLOWED_COUNTRIES_QUERY
        }
    });
    const countryFieldState = useFieldState(field);
    const { value: country } = countryFieldState;
    const selectedValue = countries.length === 1 ? countries[0].value : country;

    const countryLabel = formatMessage({
        id: 'global.country',
        defaultMessage: 'Country'
    });

    const selectProps = {
        data: countries,
        label: `${countryLabel}*`,
        fieldName: field,
        loading: loading,
        selectedValue: selectedValue,
        validate: validate
    };

    if (selectedValue) {
        selectProps.initialValue = selectedValue;
    } else if (initialValue) {
        selectProps.initialValue = initialValue;
    }

    useEffect(() => {
        const selectedValue =
            selectProps.selectedValue &&
            selectProps.data &&
            selectProps.data.filter(option => option.value === selectProps.selectedValue);
        const oldValue = formApi.getValue(field);
        if (
            selectProps.initialValue !== oldValue &&
            selectedValue &&
            head(selectedValue).value === selectProps.initialValue
        ) {
            formApi.setValue(field, selectProps.initialValue);
        }
    }, [
        field,
        formApi,
        selectProps.data,
        selectProps.selectedValue,
        countries,
        initialValue,
        selectProps.initialValue
    ]);

    return <ReactSelect {...selectProps} id={classes.root} />;
};

export default Country;

Country.defaultProps = {
    field: 'country'
};

Country.propTypes = {
    field: string,
    initialValue: string,
    validate: func
};
