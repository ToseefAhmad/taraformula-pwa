import { Checkbox as InformedCheckbox, useFieldApi } from 'informed';
import { node, shape, string, bool, oneOfType } from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { Check as CheckIcon } from 'react-feather';

import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Message } from '@magento/venia-ui/lib/components/Field';

import defaultClasses from './checkbox.module.css';

const Checkbox = props => {
    const { ariaLabel, classes: propClasses, field, fieldValue, id, label, message, isCircle = false, ...rest } = props;
    const fieldApi = useFieldApi(field);
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);
    const simpleCheckboxClasses = fieldState.value ? classes.checkbox_active : classes.checkbox_inactive;
    const circleCheckboxClasses = fieldState.value ? classes.checkbox_circle_active : classes.checkbox_circle_inactive;
    const checkboxClasses = !isCircle ? simpleCheckboxClasses : circleCheckboxClasses;
    const checkBoxContent = !isCircle ? (
        <span className={classes.icon}>
            <CheckIcon width={16} />
        </span>
    ) : (
        <span className={classes.circle} />
    );
    useEffect(() => {
        if (fieldValue != null && fieldValue !== fieldState.value) {
            fieldApi.setValue(fieldValue);
        }
    }, [fieldApi, fieldState.value, fieldValue]);

    return (
        <Fragment>
            <label aria-label={ariaLabel} className={classes.root} htmlFor={id}>
                <InformedCheckbox {...rest} className={classes.input} field={field} id={id} />
                <span className={checkboxClasses}>{checkBoxContent}</span>
                <span className={classes.label}>{label}</span>
            </label>
            <Message fieldState={fieldState}>{message}</Message>
        </Fragment>
    );
};

export default Checkbox;

Checkbox.propTypes = {
    ariaLabel: string,
    classes: shape({
        icon: string,
        input: string,
        label: string,
        message: string,
        root: string
    }),
    field: string.isRequired,
    id: string,
    label: node.isRequired,
    message: node,
    isCircle: bool,
    fieldValue: oneOfType([bool, string])
};

/* eslint-enable jsx-a11y/label-has-for */
