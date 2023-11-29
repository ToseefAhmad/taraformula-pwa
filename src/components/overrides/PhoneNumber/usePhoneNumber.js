import { useFieldApi } from 'informed';
import { useEffect, useState } from 'react';

import { arabicToEnglish } from '@app/util/arabicToEnglish';
import { COUNTRIES_PHONE_INPUT_2, UNSUPPORTED_PHONE_COUNTRY_CODES } from '@app/util/static/phoneCodes';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';

export const usePhoneNumber = props => {
    const { countryCodeField, field } = props;

    const fieldApi = useFieldApi(field);
    const countryFieldState = useFieldState(countryCodeField);
    const { value: countryFieldValue } = countryFieldState;

    const [isUnsupportedCountry, setIsUnsupportedCountry] = useState(false);
    const [realCursorPosition, setRealCursorPosition] = useState(null);

    const currentCountry = countryFieldValue ? countryFieldValue.toLowerCase() : null;

    useEffect(() => {
        if (UNSUPPORTED_PHONE_COUNTRY_CODES.includes(currentCountry)) {
            setIsUnsupportedCountry(true);
        } else {
            setIsUnsupportedCountry(false);
        }
    }, [currentCountry, fieldApi]);

    // When country changes, we are changing a correct dial code - this is needed for the phoneInput
    // To work correctly.
    useEffect(() => {
        let dialCode = false;
        if (currentCountry) {
            let startsWithAnotherCountryDialCode = '';
            let phoneNumberFieldValue = fieldApi.getValue();

            COUNTRIES_PHONE_INPUT_2.forEach(item => {
                const countryCode = item[2];
                const countryDialCode = item[3];

                if (countryCode === currentCountry) {
                    dialCode = '+' + countryDialCode;
                }
                // If changing country, check if current phone number is with another countries dial code (it should)
                if (
                    countryCode !== currentCountry &&
                    phoneNumberFieldValue &&
                    phoneNumberFieldValue.startsWith('+' + countryDialCode)
                ) {
                    startsWithAnotherCountryDialCode = '+' + countryDialCode;
                }
            });

            // If it is, remove it from the start of the phone number
            // This fixes issue, when you have phone number entered and then change the country, we need to have
            // The phone number here without the previous country dial code
            if (startsWithAnotherCountryDialCode !== '') {
                phoneNumberFieldValue = phoneNumberFieldValue.replace(startsWithAnotherCountryDialCode, '');
            }

            if (dialCode && phoneNumberFieldValue && !phoneNumberFieldValue.startsWith(dialCode)) {
                fieldApi.setValue(dialCode + phoneNumberFieldValue);
            }
        }
    }, [currentCountry, fieldApi]);

    const onInputChange = (number, countryData, event, formattedValue) => {
        const enteredCharacter = event.nativeEvent.data;
        if (enteredCharacter) {
            const enteredCharacterToEng = arabicToEnglish(enteredCharacter);
            // If we have a translation for entered Arabic numbers
            if (enteredCharacter !== enteredCharacterToEng && realCursorPosition) {
                number =
                    formattedValue.substring(0, realCursorPosition) +
                    enteredCharacterToEng +
                    formattedValue.substring(realCursorPosition);
                // Since we needed a formattedValue to find a cursor position correctly, we have to manually
                // Remove all automatically added formatting
                number = number.replace(/[ ()-]/g, '');
            }
        }

        let value = `+${number}`;
        // Don't add '+' for unsupported countries
        if (isUnsupportedCountry) {
            value = number;
        }

        fieldApi.setValue(value);
    };

    const onInputKeyDown = event => {
        // We are setting cursor position only because of Arabic numbers. The problem in onChange event
        // Is that when you enter Arabic number, it is not passed to that event (we are adding it manually)
        // And therefore cursor position in that event is not correct.
        setRealCursorPosition(event.target.selectionStart);
    };

    return {
        currentCountry,
        isUnsupportedCountry,
        onInputChange,
        onInputKeyDown
    };
};
