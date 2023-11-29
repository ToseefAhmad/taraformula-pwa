import { useFormApi } from 'informed';
import { any, bool, func, number, object, string } from 'prop-types';
import React from 'react';
import { arabicToEnglish } from 'src/util/arabicToEnglish';

import ReactSelect from '@app/components/ReactSelect';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import { useAddressField } from './useAddressField';

const AddressField = ({
    className,
    id,
    parent_id,
    parent_code,
    mapped_parent_code,
    mapped_code,
    name,
    type,
    required,
    initialValues,
    validate = null
}) => {
    const formApi = useFormApi();
    const parentFieldState = useFieldState(mapped_parent_code);
    const selectedParentValue = parentFieldState ? parentFieldState.value : null;
    const fieldName = mapped_code === 'street' ? 'street[0]' : mapped_code;
    const fieldState = useFieldState(fieldName);
    const { value: selectedValue } = fieldState;
    let initialValue = null;
    let initialValueFieldName = fieldName;

    /**
     * Mapping for checkout billing address
     * field initial values
     */
    if (fieldName === 'house_building') {
        initialValueFieldName = 'houseBuilding';
    } else if (fieldName === 'postal_code') {
        initialValueFieldName = 'postalCode';
    } else if (fieldName === 'id_number') {
        initialValueFieldName = 'idNumber';
    } else if (fieldName === 'additional_numbers') {
        initialValueFieldName = 'additionalNumbers';
    } else if (fieldName === 'street[0]') {
        initialValueFieldName = 'street1';
    } else if (fieldName === 'region[region]') {
        initialValueFieldName = 'region';
    }

    if (initialValueFieldName in initialValues) {
        initialValue = initialValues[initialValueFieldName];
    }

    const defaultLabel = `${name}${required ? '*' : ''}`;
    const { fetched, loading, data } = useAddressField({
        addressId: type === 'select' ? id : null,
        parentId: parent_id,
        parentField: parent_code,
        selectedParentValue: selectedParentValue,
        selectedValue: selectedValue
    });
    let addressField;

    if (type === 'select') {
        const selectProps = {
            data: data,
            label: defaultLabel,
            fieldName: fieldName,
            loading: loading,
            selectedValue: selectedValue,
            validate: required && validate
        };

        if (initialValue) {
            selectProps.initialValue = initialValue;
        }

        addressField = (!fetched || loading || (fetched && data.length > 0)) && <ReactSelect {...selectProps} />;
    } else {
        const inputProps = {
            label: defaultLabel,
            field: fieldName,
            validate: required && validate
        };

        if (initialValue) {
            inputProps.initialValue = initialValue;
        }

        // Translate Arabic to Eng for postal code
        if (fieldName === 'postal_code') {
            addressField = (
                <TextInput
                    {...inputProps}
                    onChange={e => formApi.setValue(fieldName, arabicToEnglish(e.target.value))}
                />
            );
        } else {
            addressField = <TextInput {...inputProps} />;
        }
    }

    return <div className={className}>{addressField}</div>;
};

AddressField.propTypes = {
    className: string,
    id: number,
    parent_id: any,
    parent_code: any,
    mapped_parent_code: any,
    mapped_code: string,
    name: string,
    type: string,
    required: bool,
    initialValues: object,
    validate: func
};

export default AddressField;
