import { number, oneOf, string } from 'prop-types';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import { useTabbyPromo } from './useTabbyPromo';

const TabbyPromoContainer = ({ price, currency, source }) => {
    const { locale } = useIntl();
    const { isEnabled, publicKey } = useTabbyPromo();

    useEffect(() => {
        if (TabbyPromo && isEnabled) {
            try {
                new TabbyPromo({
                    selector: '#TabbyPromo',
                    currency,
                    price,
                    lang: locale.split('-')[0],
                    source,
                    api_key: publicKey
                });
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error(error);
                }
            }
        }
    }, [locale, price, currency, publicKey, isEnabled, source]);

    return <div id="TabbyPromo" />;
};

TabbyPromoContainer.propTypes = {
    price: number,
    currency: string,
    source: oneOf(['cart', 'product'])
};

export default TabbyPromoContainer;
