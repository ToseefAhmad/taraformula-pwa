import { bool } from 'prop-types';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Delivery as DeliveryIcon } from '@app/components/Icons';
import { formatPriceString } from '@app/util/formatPriceString';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './freeShipping.module.css';
import { useFreeShipping } from './useFreeShipping';

const FreeShipping = ({ isMiniCart = false }) => {
    const { amountToEligible, currency, isFreeShippingEnabled, isEligible } = useFreeShipping();
    const { locale } = useIntl();

    const freeShippingMessage = useMemo(() => {
        if (isMiniCart) {
            if (!currency) {
                return null;
            }
            return !isEligible ? (
                <FormattedMessage
                    id={'freeShipping.reminder'}
                    defaultMessage={'Add {difference} for free shipping!'}
                    values={{
                        difference: <b>{formatPriceString(amountToEligible, currency, locale)}</b>
                    }}
                />
            ) : (
                <FormattedMessage id={'freeShipping.miniCart'} defaultMessage={'You are eligible for free shipping!'} />
            );
        } else {
            return (
                <FormattedMessage id={'freeShipping.cart'} defaultMessage={'Checkout now to receive free shipping!'} />
            );
        }
    }, [isMiniCart, isEligible, currency, locale, amountToEligible]);

    if (!isFreeShippingEnabled) return null;

    return (
        <div className={classes.root}>
            <Icon src={DeliveryIcon} classes={{ root: classes.iconWrapper, icon: classes.icon }} />
            <span className={classes.textWrapper}>{freeShippingMessage}</span>
        </div>
    );
};

FreeShipping.propTypes = {
    isMiniCart: bool
};

export default FreeShipping;
