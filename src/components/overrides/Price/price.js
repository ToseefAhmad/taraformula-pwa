import { number, string, shape } from 'prop-types';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import { getDirection } from '@app/hooks/useDirection';
import patches from '@magento/peregrine/lib/util/intlPatches';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './price.module.css';

/**
 * The **Price** component is used anywhere a price needs to be displayed.
 *
 * Formatting of prices and currency symbol selection is handled entirely by the ECMAScript Internationalization API available in modern browsers.
 *
 * A [polyfill][] is required for any JavaScript runtime that does not have [Intl.NumberFormat.prototype.formatToParts][].
 *
 * [polyfill]: https://www.npmjs.com/package/intl
 * [Intl.NumberFormat.prototype.formatToParts]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
 */

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

const getPrice = parts => {
    return parts.map((part, i) => {
        const key = `${i}-${part.value}`;

        return <span key={key}>{part.value}</span>;
    });
};

const Price = props => {
    const { locale } = useIntl();
    const { value, oldValue, currencyCode } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const parts = getParts(locale, currencyCode, value);
    const price = getPrice(parts);
    let oldPrice;

    if (oldValue && oldValue > value) {
        const oldParts = getParts(locale, currencyCode, oldValue);
        oldPrice = getPrice(oldParts);
    }

    return (
        <Fragment>
            <span className={classes.priceWrapper} dir={getDirection()}>
                {oldPrice && <span className={classes.oldPrice}>{oldPrice}</span>}
                <span>{price}</span>
            </span>
        </Fragment>
    );
};

Price.propTypes = {
    /**
     * Class names to use when styling this component
     */
    classes: shape({
        currency: string,
        integer: string,
        decimal: string,
        fraction: string
    }),
    /**
     * The numeric price
     */
    value: number.isRequired,
    /**
     * The numeric old price
     */
    oldValue: number,
    /**
     * A string with any of the currency code supported by Intl.NumberFormat
     */
    currencyCode: string.isRequired
};

Price.defaultProps = {
    classes: {}
};

export default Price;
