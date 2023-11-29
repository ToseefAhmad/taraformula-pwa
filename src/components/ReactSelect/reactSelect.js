import { useFieldApi } from 'informed';
import { any, array, bool, func, oneOfType, string } from 'prop-types';
import React from 'react';
import Select, { components } from 'react-select';

import { ArrowDown as arrowDownIcon } from '@app/components/Icons';
import Field from '@magento/venia-ui/lib/components/Field';
import Icon from '@magento/venia-ui/lib/components/Icon';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import classes from './reactSelect.module.css';

const DropdownIndicator = props => {
    return (
        <components.DropdownIndicator {...props}>
            <Icon src={arrowDownIcon} size={30} />
        </components.DropdownIndicator>
    );
};

const ReactSelect = ({
    data,
    label,
    fieldName,
    loading,
    selectedValue = null,
    validate = null,
    initialValue = null
}) => {
    const fieldApi = useFieldApi(fieldName);
    const handleChange = selectedOption => {
        fieldApi.exists() && fieldApi.setValue(selectedOption.value);
    };
    const invalid = fieldApi.exists() && fieldApi.getError();
    const selectClasses = `${classes.select} ${invalid ? classes.invalid : ''}`;

    const inputProps = {
        field: fieldName,
        classes: classes,
        validate: validate
    };

    if (initialValue) {
        inputProps.initialValue = initialValue;
    }

    return (
        <Field label={label}>
            <Select
                components={{ DropdownIndicator }}
                options={data}
                value={selectedValue && data && data.filter(option => option.value === selectedValue)}
                placeholder={label}
                onChange={handleChange}
                isDisabled={loading || !data.length}
                isSearchable={true}
                className={selectClasses}
                classNamePrefix={'element'}
            />
            <TextInput {...inputProps} />
        </Field>
    );
};

ReactSelect.propTypes = {
    data: array,
    label: string,
    fieldName: string,
    loading: bool,
    selectedValue: any,
    validate: oneOfType([func, bool]),
    initialValue: any
};

export default ReactSelect;
