import { useFieldApi } from 'informed';
import { func, number, oneOfType, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import ReactSelect from '@app/components/ReactSelect';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import { GET_REGIONS_QUERY } from '@magento/venia-ui/lib/components/Region/region.gql';
import defaultClasses from '@magento/venia-ui/lib/components/Region/region.module.css';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import { useRegion } from './useRegion';

/**
 * Form component for Region that is seeded with backend data.
 *
 * @param {string} props.optionValueKey - Key to use for returned option values. In a future
 * release, this will be removed and hard-coded to use "id" once GraphQL has resolved MC-30886.
 */
const Region = props => {
    const {
        classes: propClasses,
        countryCodeField,
        fieldInput,
        fieldSelect,
        label,
        optionValueKey,
        translationId,
        validate,
        ...inputProps
    } = props;

    const talonProps = useRegion({
        countryCodeField,
        fieldInput,
        fieldSelect,
        optionValueKey,
        queries: { getRegionsQuery: GET_REGIONS_QUERY }
    });
    const { loading, regions } = talonProps;
    const { formatMessage } = useIntl();
    const regionLabel = formatMessage({
        id: translationId,
        defaultMessage: label
    });

    const classes = useStyle(defaultClasses, propClasses);
    const regionProps = {
        classes,
        disabled: loading,
        ...inputProps
    };
    const regionSelectFieldApi = useFieldApi(fieldSelect);

    const selectProps = {
        data: regions,
        label: `${label}*`,
        fieldName: fieldSelect,
        loading: loading,
        selectedValue: regionSelectFieldApi.exists() && regionSelectFieldApi.getValue(),
        validate: validate
    };

    const regionField =
        regions.length > 1 || loading ? (
            <ReactSelect {...selectProps} id={classes.root} />
        ) : (
            <Field id={classes.root} label={regionLabel} optional={false} classes={{ root: classes.root }}>
                <TextInput {...regionProps} field={fieldInput} id={classes.root} />
            </Field>
        );

    return regionField;
};

export default Region;

Region.defaultProps = {
    countryCodeField: 'country',
    fieldInput: 'region',
    fieldSelect: 'region',
    label: 'State',
    translationId: 'region.label',
    optionValueKey: 'code'
};

Region.propTypes = {
    classes: shape({
        root: string
    }),
    countryCodeField: string,
    fieldInput: string,
    fieldSelect: string,
    label: string,
    translationId: string,
    optionValueKey: string,
    validate: func,
    initialValue: oneOfType([number, string])
};
