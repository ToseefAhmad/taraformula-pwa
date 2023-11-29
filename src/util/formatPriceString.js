import patches from '@magento/peregrine/lib/util/intlPatches';

const getParts = (locale, currencyCode, value) => {
    const translatedParts = patches.toParts.call(
        new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }),
        value
    );

    const localeParts = locale.split('-');

    // If Arabic, translate only currency and not the numbers.
    if (localeParts[0] === 'ar') {
        const defaultParts = getPartsDefault(currencyCode, value);

        // Only currency itself needs to be translated. All other parts needs to be in English.
        const translatedCurrency = getPartFromParts(translatedParts, 'currency');

        if (translatedCurrency && translatedCurrency.value) {
            // Return all default parts except currency which we are translating.
            const parts = changePartInParts(defaultParts, 'currency', translatedCurrency.value);

            const currencyPart = getPartFromParts(parts, 'currency');
            const literalPart = getPartFromParts(parts, 'literal');
            const integerPart = getPartFromParts(parts, 'integer');
            const decimalPart = getPartFromParts(parts, 'decimal');
            const fractionPart = getPartFromParts(parts, 'fraction');

            // Change parts in Arabic so that first goes currency and then numbers
            // It looks other way around in array, but that's because later in the browser we will do dir='rtl'
            return [integerPart, decimalPart, fractionPart, literalPart, currencyPart].filter(part => part);
        }
    }

    return translatedParts;
};

const getPartsDefault = (currencyCode, value) => {
    return patches.toParts.call(
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currencyCode,
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        }),
        value
    );
};

const getPartFromParts = (parts, getPart) => {
    return parts.find(part => part.type === getPart);
};

const changePartInParts = (parts, part, value) => {
    for (let i = 0; i < parts.length; i++) {
        if (parts[i].type === part) {
            parts[i].value = value;
        }
    }
    return parts;
};

export const formatPriceString = (value, currencyCode, locale) =>
    getParts(locale, currencyCode, value)
        .map(part => part.value)
        .join('');
