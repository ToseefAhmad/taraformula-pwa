import classnames from 'classnames';
import { bool, number, oneOfType } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useCityCarriers } from '@app/components/CityCarriers/useCityCarriers';
import CityModal from '@app/components/CityModal';
import CityModalOpenButton from '@app/components/CityModal/cityModalOpenButton';
import { Delivery as DeliveryIcon } from '@app/components/Icons';
import { Directions, getDirection } from '@app/hooks/useDirection';
import { useStores } from '@app/hooks/useStores/useStores';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './getItBy.module.css';
import { UseGetItBy } from './useGetItBy';

const GetItBy = ({ isCart, hasShippingSummary }) => {
    const { allCitiesAndCarriers, selectedCityAndCarriers, handleSelectCity } = useCityCarriers();
    const { currentGroupName, currentStoreGroupCode } = useStores();
    const { formatMessage } = useIntl();
    const selectedCity = selectedCityAndCarriers && selectedCityAndCarriers.city ? selectedCityAndCarriers.city : null;
    const { date, hoursLeftUntilDispatch, minutesLeftUntilDispatch } = UseGetItBy(selectedCity, isCart);

    if (!date || !date.month || !date.day) {
        return null;
    }

    let orderWithinText = null;

    if (hoursLeftUntilDispatch > 0) {
        const hoursText =
            hoursLeftUntilDispatch > 1 ? (
                <FormattedMessage id={'global.hours'} defaultMessage={'hours'} />
            ) : (
                <FormattedMessage id={'global.hour'} defaultMessage={'hour'} />
            );

        orderWithinText = (
            <div className={classes.orderWithin}>
                <FormattedMessage id={'global.orderwithin'} defaultMessage={'Order within the next'} />{' '}
                <b>
                    {hoursLeftUntilDispatch} {hoursText} {minutesLeftUntilDispatch > 0 ? minutesLeftUntilDispatch : ''}{' '}
                    {minutesLeftUntilDispatch > 0 ? (
                        <FormattedMessage id={'global.min'} defaultMessage={'min.'} />
                    ) : null}
                </b>
            </div>
        );
    }

    const rtlDirection = getDirection() === Directions.rtl;

    const cartClass = isCart ? classes.rootCart : '';
    const cartClassHasShip = isCart && hasShippingSummary ? classes.rootCartShip : '';
    const websiteName = formatMessage({
        id: 'storeGroupCode.' + currentStoreGroupCode,
        defaultMessage: currentGroupName
    });
    const restOfMessage = (
        <FormattedMessage id={'global.restof'} defaultMessage="Rest of {country}" values={{ country: websiteName }} />
    );

    let cityModalOpenButton = null;
    if (selectedCityAndCarriers && selectedCityAndCarriers.city) {
        const cityModalOpenButtonMessage = selectedCityAndCarriers.city === 'default' ? restOfMessage : selectedCity;
        cityModalOpenButton = (
            <Fragment>
                {' ('}
                <CityModalOpenButton text={cityModalOpenButtonMessage} />
                {')'}
            </Fragment>
        );
    }

    return (
        <div className={classnames(classes.root, cartClass, cartClassHasShip)}>
            <Icon src={DeliveryIcon} classes={{ icon: classes.icon }} />
            <span>
                <FormattedMessage id={'global.getitby'} defaultMessage={'Get it by'} /> {rtlDirection ? '' : ' '}
            </span>
            <span>
                <b>
                    <FormattedMessage id={'global.month.' + date.month} defaultMessage={date.month} /> {date.day}
                    {rtlDirection ? '' : '.'}
                </b>
            </span>
            {isCart && (
                <span>
                    <CityModal cityList={allCitiesAndCarriers} handleSelectCity={handleSelectCity} />
                    {cityModalOpenButton}
                </span>
            )}
            {orderWithinText}
        </div>
    );
};

GetItBy.propTypes = {
    isCart: bool,
    hasShippingSummary: oneOfType([bool, number])
};

export default GetItBy;
