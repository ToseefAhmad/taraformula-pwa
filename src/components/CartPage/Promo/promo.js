import { func, number, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { formatPriceString } from '@app/util/formatPriceString';
import Image from '@magento/venia-ui/lib/components/Image';

import ModalButton from './ModalButton';
import classes from './promo.module.css';
import present from './static/present.svg';
import { usePromo } from './usePromo';

const Promo = ({ subtotal, currency, setShowComplimentaryGiftModal }) => {
    const { amountToEligible, isEligible, isFreeGift, isPromoActive } = usePromo({ subtotal });
    const { locale } = useIntl();

    if (!isPromoActive) {
        return null;
    }

    return (
        <div className={classes.root}>
            <span className={classes.iconWrapper}>
                <Image alt={'Gift'} src={present} height={20} width={20} />
            </span>
            <span className={classes.textWrapper}>
                {isEligible ? (
                    <>
                        {isFreeGift ? (
                            <FormattedMessage
                                id={'promo.freeGiftEligible'}
                                defaultMessage={
                                    'We have added a free gift to your shopping bag. If you’d like to choose another one, click {here}.'
                                }
                                values={{
                                    here: <ModalButton setShowComplimentaryGiftModal={setShowComplimentaryGiftModal} />
                                }}
                            />
                        ) : (
                            <FormattedMessage
                                id={'promo.discountEligible'}
                                defaultMessage={'You have received a DISCOUNT - Your cart has been updated!'}
                            />
                        )}
                    </>
                ) : (
                    <FormattedMessage
                        id={'promo.reminder'}
                        defaultMessage={'You are only {difference} away from receiving a {reward}!'}
                        values={{
                            difference: <b>{formatPriceString(amountToEligible, currency, locale)}</b>,
                            reward: (
                                <b>
                                    {isFreeGift ? (
                                        <FormattedMessage id={'promo.freeGift'} defaultMessage={'complimentary gift'} />
                                    ) : (
                                        <FormattedMessage id={'promo.discount'} defaultMessage={'discount'} />
                                    )}
                                </b>
                            )
                        }}
                    />
                )}
            </span>
        </div>
    );
};

Promo.propTypes = {
    subtotal: number,
    currency: string,
    setShowComplimentaryGiftModal: func
};

export default Promo;
