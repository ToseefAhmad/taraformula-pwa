import libphonenumber from 'google-libphonenumber';

import { UNSUPPORTED_PHONE_COUNTRY_CODES } from './static/phoneCodes';

export const isValidPhoneNumber = (value, values) => {
    const SUCCESS = undefined;
    const FAILURE = {
        id: 'validation.phoneNumberError',
        defaultMessage: 'Please enter a valid phone number.'
    };

    if (value.length < 5) {
        return FAILURE;
    }

    let selectedCountry;

    if (values && values.country) {
        selectedCountry = values.country.toLowerCase();
    } else if (values && values.country_code) {
        selectedCountry = values.country_code.toLowerCase();
    }

    // If unsupported country from 'react-phone-input-2' selected, disable further validation from Google
    if (selectedCountry && UNSUPPORTED_PHONE_COUNTRY_CODES.includes(selectedCountry)) {
        return SUCCESS;
    }

    if (!selectedCountry) {
        return FAILURE;
    }

    selectedCountry = selectedCountry.toUpperCase();

    const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    const parsedNumber = phoneUtil.parse(value, selectedCountry);
    const status = phoneUtil.isValidNumberForRegion(parsedNumber, selectedCountry);

    if (!status) {
        return FAILURE;
    }

    return SUCCESS;
};

export const isValidPhoneNumberForCountry = (value, countryCode) => {
    const SUCCESS = undefined;
    const FAILURE = {
        id: 'validation.phoneNumberError',
        defaultMessage: 'Please enter a valid phone number.'
    };

    if (value.length < 5 || !countryCode) {
        return FAILURE;
    }

    const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
    const parsedNumber = phoneUtil.parse(value, countryCode.toUpperCase());
    const status = phoneUtil.isValidNumberForRegion(parsedNumber, countryCode.toUpperCase());

    if (!status) {
        return FAILURE;
    }

    return SUCCESS;
};
