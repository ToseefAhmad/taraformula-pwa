import { number, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';

const CodSummary = ({ data, classes: propClasses }) => {
    const classes = useStyle({}, propClasses);

    return (
        data.currency &&
        data.value && (
            <div className={classes.codSummary}>
                <span className={classes.codLabel}>
                    <FormattedMessage id={'codSummary.codFee'} defaultMessage={'Cash on delivery fee'} />
                </span>
                <span className={classes.price}>
                    <Price value={data.value} currencyCode={data.currency} />
                </span>
            </div>
        )
    );
};

CodSummary.propTypes = {
    classes: shape({
        codSummary: string,
        codLabel: string,
        price: string
    }),
    data: shape({
        currency: string,
        value: number
    })
};
export default CodSummary;
