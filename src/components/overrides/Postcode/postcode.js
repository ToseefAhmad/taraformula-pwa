import { useFormApi } from 'informed';
import { shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { arabicToEnglish } from 'src/util/arabicToEnglish';

import { usePostcode } from '@magento/peregrine/lib/talons/Postcode/usePostcode';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import defaultClasses from '@magento/venia-ui/lib/components/Postcode/postcode.module.css';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

const Postcode = ({ classes: propClasses, fieldInput, label, ...inputProps }) => {
    const classes = useStyle(defaultClasses, propClasses);
    const postcodeProps = {
        classes,
        ...inputProps
    };

    const { formatMessage } = useIntl();

    const fieldLabel =
        label ||
        formatMessage({
            id: 'postcode.label',
            defaultMessage: 'ZIP / Postal Code'
        });

    usePostcode({ fieldInput });

    const formApi = useFormApi();

    return (
        <Field id={classes.root} label={fieldLabel} classes={{ root: classes.root }} optional={false}>
            <TextInput
                {...postcodeProps}
                field={fieldInput}
                id={classes.root}
                onChange={e => formApi.setValue(fieldInput, arabicToEnglish(e.target.value))}
            />
        </Field>
    );
};

export default Postcode;

Postcode.defaultProps = {
    fieldInput: 'postcode'
};

Postcode.propTypes = {
    classes: shape({
        root: string
    }),
    fieldInput: string,
    label: string
};
