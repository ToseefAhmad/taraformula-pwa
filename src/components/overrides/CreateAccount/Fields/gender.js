import { useQuery } from '@apollo/client';
import { func, string } from 'prop-types';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { GET_GENDER_ATTRIBUTE_QUERY } from '@app/components/overrides/CreateAccount/Fields/gender.gql';
import ReactSelect from '@app/components/ReactSelect';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

const Gender = ({ field, initialValue, validate = null }) => {
    const { formatMessage } = useIntl();
    const { data, loading } = useQuery(GET_GENDER_ATTRIBUTE_QUERY);

    const genders = useMemo(() => {
        if (loading || !data || !data.customAttributeMetadata.items.length) {
            return [];
        }

        const genderAttribute = data.customAttributeMetadata.items.find(
            attribute => attribute.attribute_code === 'gender'
        );
        if (!genderAttribute) {
            return [];
        }

        return genderAttribute.attribute_options.map(option => ({
            key: parseInt(option.value),
            value: parseInt(option.value),
            label: option.label
        }));
    }, [loading, data]);

    const fieldState = useFieldState(field);
    const { value: gender } = fieldState;
    const selectedValue = genders.length === 1 ? genders[0].value : gender;

    const genderLabel = formatMessage({
        id: 'createAccount.genderText',
        defaultMessage: 'Gender'
    });

    const selectProps = {
        data: genders,
        label: `${genderLabel}*`,
        fieldName: field,
        selectedValue: selectedValue,
        validate: validate,
        loading: loading
    };

    if (selectedValue) {
        selectProps.initialValue = selectedValue;
    } else if (initialValue) {
        selectProps.initialValue = initialValue;
    }

    return <ReactSelect {...selectProps} />;
};

export default Gender;

Gender.defaultProps = {
    field: 'gender'
};

Gender.propTypes = {
    field: string,
    initialValue: string,
    validate: func
};
