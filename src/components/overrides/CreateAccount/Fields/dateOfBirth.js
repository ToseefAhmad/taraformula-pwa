import { range } from 'lodash';
import moment from 'moment';
import { array, func, number, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import Field from '@app/components/overrides/Field';
import ReactSelect from '@app/components/ReactSelect';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

const DateOfBirthField = ({ field, initialValue, label, data, validate = null }) => {
    const fieldState = useFieldState(field);
    const { value: selectedValue } = fieldState;

    const selectProps = {
        data: data,
        label: `${label}*`,
        fieldName: field,
        selectedValue: selectedValue,
        validate: validate
    };

    if (selectedValue) {
        selectProps.initialValue = selectedValue;
    } else if (initialValue) {
        selectProps.initialValue = initialValue;
    }

    return <ReactSelect {...selectProps} />;
};

const DateOfBirth = ({ field, initialValue, validate = null }) => {
    const { formatMessage } = useIntl();
    const initialDate = moment(initialValue);

    const yearLabel = formatMessage({
        id: 'createAccount.dob.yearText',
        defaultMessage: 'Year'
    });

    const years = range(1900, new Date().getFullYear() + 1).map(year => ({
        key: year,
        value: year,
        label: year
    }));

    const monthLabel = formatMessage({
        id: 'createAccount.dob.monthText',
        defaultMessage: 'Month'
    });

    const months = range(1, 12 + 1).map(month => ({
        key: month,
        value: month,
        label: month
    }));

    const dayLabel = formatMessage({
        id: 'createAccount.dob.dayText',
        defaultMessage: 'Day'
    });

    const days = range(1, 31 + 1).map(day => ({
        key: day,
        value: day,
        label: day
    }));

    return (
        <>
            <Field>
                <DateOfBirthField
                    field={`${field}.year`}
                    label={yearLabel}
                    data={years}
                    validate={validate}
                    initialValue={initialDate.year()}
                />
            </Field>
            <Field>
                <DateOfBirthField
                    field={`${field}.month`}
                    label={monthLabel}
                    data={months}
                    validate={validate}
                    initialValue={initialDate.month() + 1}
                />
            </Field>
            <Field>
                <DateOfBirthField
                    field={`${field}.day`}
                    label={dayLabel}
                    data={days}
                    validate={validate}
                    initialValue={initialDate.date()}
                />
            </Field>
        </>
    );
};

export default DateOfBirth;

DateOfBirth.defaultProps = {
    field: 'date_of_birth'
};

DateOfBirth.propTypes = {
    field: string,
    initialValue: string,
    validate: func
};

DateOfBirthField.propTypes = {
    field: string,
    initialValue: number,
    validate: func,
    label: string,
    data: array
};
