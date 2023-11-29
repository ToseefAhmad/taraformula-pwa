import { asField } from 'informed';
import { string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import PhoneInput from 'react-phone-input-2';

import 'react-phone-input-2/lib/style.css';
import { usePhoneNumber } from '@app/components/overrides/PhoneNumber/usePhoneNumber';
import { FieldIcons, Message } from '@magento/venia-ui/lib/components/Field';

import classes from './phoneNumber.module.css';

const PhoneNumber = asField(({ countryCodeField, field, fieldState }) => {
    const talonProps = usePhoneNumber({
        countryCodeField,
        field
    });

    const { currentCountry, isUnsupportedCountry, onInputChange, onInputKeyDown } = talonProps;

    const { formatMessage } = useIntl();

    const label = formatMessage({
        id: 'global.phoneNumber',
        defaultMessage: 'Phone Number'
    });

    return (
        <div className={classes.root}>
            <FieldIcons>
                <PhoneInput
                    country={currentCountry ? currentCountry : 'us'}
                    onlyCountries={[currentCountry ? currentCountry : 'us']} // Limiting country selection to be only the same as country selected
                    inputProps={{
                        placeholder: '',
                        dir: 'ltr'
                    }}
                    countryCodeEditable={isUnsupportedCountry} // If unsupported country, allow to edit country code
                    disableDropdown={!isUnsupportedCountry} // If unsupported country, allow dropdown
                    value={fieldState.value && fieldState.value.toString()}
                    onChange={onInputChange}
                    onKeyDown={onInputKeyDown}
                    key={currentCountry}
                    inputStyle={fieldState.error && { background: 'rgba(253, 60, 29, 0.05)' }}
                    buttonClass={isUnsupportedCountry ? 'invisible' : ''} // Hide country dropdown if unsupported country
                />
            </FieldIcons>
            <span className={classes.label}>{label}*</span>
            {fieldState.error && <Message fieldState={fieldState}>{fieldState.error.defaultMessage}</Message>}
        </div>
    );
});

PhoneNumber.propTypes = {
    countryCodeField: string,
    field: string
};

export default PhoneNumber;
