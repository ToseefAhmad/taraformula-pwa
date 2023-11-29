import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import CityModal from '@app/components/CityModal';
import CityModalOpenButton from '@app/components/CityModal/cityModalOpenButton';
import { Delivery as DeliveryIcon } from '@app/components/Icons';
import { useStoreConfigContext } from '@app/context/StoreConfigContext/useStoreConfigContext';
import { useStores } from '@app/hooks/useStores/useStores';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './cityCarriers.module.css';
import { useCityCarriers } from './useCityCarriers';

const CityCarriers = () => {
    const { storeConfigData } = useStoreConfigContext();
    const { formatMessage } = useIntl();
    const { allCitiesAndCarriers, selectedCityAndCarriers, handleSelectCity } = useCityCarriers();
    const { currentGroupName, currentStoreGroupCode } = useStores();

    const websiteName = formatMessage({
        id: 'storeGroupCode.' + currentStoreGroupCode,
        defaultMessage: currentGroupName
    });

    const storeConfig = storeConfigData.storeConfig;

    if (!allCitiesAndCarriers || !allCitiesAndCarriers.length) {
        return null;
    }

    const andMessage = <FormattedMessage id={'global.and'} defaultMessage={'and'} />;
    const restOfMessage = (
        <FormattedMessage id={'global.restof'} defaultMessage="Rest of {country}" values={{ country: websiteName }} />
    );

    const cityModalOpenButtonTxt =
        selectedCityAndCarriers.city === 'default' ? restOfMessage : selectedCityAndCarriers.city;

    const shippingFrom = storeConfig.shipping_from_label_general_enable ? (
        <div className={classes.deliveryFrom}>
            <Icon src={DeliveryIcon} classes={{ root: classes.iconWrapper, icon: classes.icon }} />
            <span>
                <FormattedMessage id={'global.shippingFrom'} defaultMessage={'Shipping from'} />
            </span>
            <b className={classes.deliveryFromLabel}>{storeConfig.shipping_from_label_general_ship_from_label}</b>
        </div>
    ) : null;

    return (
        <div className={classes.root}>
            {shippingFrom}
            <div className={classes.deliveryTo}>
                <span>
                    {selectedCityAndCarriers.shipping_methods.map((method, i) => (
                        <span key={i}>
                            <b key={i}>{method}</b>
                            {i !== selectedCityAndCarriers.shipping_methods.length - 1 && <span> {andMessage} </span>}
                        </span>
                    ))}
                </span>{' '}
                <FormattedMessage id={'global.deliveryTo'} defaultMessage={'delivery to'} />{' '}
                <CityModal cityList={allCitiesAndCarriers} handleSelectCity={handleSelectCity} />
                <CityModalOpenButton text={cityModalOpenButtonTxt} />
            </div>
        </div>
    );
};

export default CityCarriers;
