import { useQuery } from '@apollo/client';

import { GET_API_COUNTRIES_QUERY, GET_API_ADDRESS_FIELDS, GET_API_DATA_QUERY } from './addressApi.gql';

export const useAddressApi = () => {
    const { data } = useQuery(GET_API_COUNTRIES_QUERY, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    let formattedCountries = [];

    if (data && data.getTaraCountries) {
        const { countries } = data.getTaraCountries;

        formattedCountries =
            countries &&
            countries.map(country => ({
                key: country.iso_code,
                name: country.iso_code,
                value: country.id,
                mapping: country.mapping
            }));
    }

    const GetApiAddressFields = countryId => {
        const { data, loading, error } = useQuery(GET_API_ADDRESS_FIELDS, {
            variables: {
                countryId: countryId
            },
            skip: !countryId,
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        });

        if (loading || error) return null;

        if (data && data.getTaraAddressFields) {
            return data.getTaraAddressFields.items;
        }
    };

    const GetApiAddressData = (addressId, selectedValue, parentId, parentField) => {
        const { data, loading, error } = useQuery(GET_API_DATA_QUERY, {
            variables: {
                addressId: addressId,
                parentId: parentId,
                parentField: parentField,
                selectedValue: selectedValue
            },
            skip: !addressId || (parentField && !selectedValue),
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        });

        if (!addressId || (parentField && !selectedValue)) {
            return {
                fetched: false,
                loading: false,
                data: []
            };
        }

        if (loading || error) {
            return {
                fetched: true,
                loading: loading,
                data: []
            };
        }

        if (data && data.getTaraAddressData) {
            return {
                fetched: true,
                loading: false,
                data: data.getTaraAddressData.items
            };
        }
    };

    return {
        countries: formattedCountries,
        GetApiAddressFields,
        GetApiAddressData
    };
};
