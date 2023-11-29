import { Text as InformedText } from 'informed';
import { bool, node, shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { FieldIcons, Message } from '@magento/venia-ui/lib/components/Field';

import defaultClasses from './textInput.module.css';

const TextInput = ({ after, before, classes: propClasses, field, message, label, optional, ...rest }) => {
    const fieldState = useFieldState(field);
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);
    const inputClass = fieldState.error ? classes.input_error : classes.input;

    const optionalFieldAnnex = formatMessage({
        id: 'global.optional',
        defaultMessage: 'optional'
    });

    let formattedLabel;
    if (typeof optional === 'undefined') {
        formattedLabel = label;
    } else {
        formattedLabel = optional ? `${label} (${optionalFieldAnnex})` : `${label}*`;
    }

    return (
        <Fragment>
            <FieldIcons after={after} before={before}>
                <InformedText {...rest} className={inputClass} field={field} placeholder={formattedLabel} />
                <span className={classes.label}>{formattedLabel}</span>
            </FieldIcons>
            <Message fieldState={fieldState}>{message}</Message>
        </Fragment>
    );
};

export default TextInput;

TextInput.propTypes = {
    after: node,
    before: node,
    classes: shape({
        input: string,
        label: string
    }),
    label: string,
    optional: bool,
    field: string.isRequired,
    message: node
};
