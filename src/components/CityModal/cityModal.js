import { array, func } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Close as IconClose } from '@app/components/Icons';
import { useScreenSize } from '@app/hooks/useScreenSize';
import { useStores } from '@app/hooks/useStores/useStores';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './cityModal.module.css';
import desktopClasses from './cityModalDesktop.module.css';
import { UseCityModal } from './useCityModal';

const CityModal = props => {
    const { isDesktopXlScreen } = useScreenSize();
    const { isOpen, handleToggle } = UseCityModal();
    const { currentGroupName, currentStoreGroupCode } = useStores();
    const { formatMessage } = useIntl();

    const { cityList, handleSelectCity } = props;

    const classesToUse = isDesktopXlScreen ? desktopClasses : classes;

    const rootClassName = isOpen ? classesToUse.root_open : classesToUse.root;
    const [{ headerRef }] = useAppContext();

    if (!isOpen) {
        return null;
    }

    const websiteName = formatMessage({
        id: 'storeGroupCode.' + currentStoreGroupCode,
        defaultMessage: currentGroupName
    });

    const rootStyle = {
        marginTop: headerRef && headerRef.current ? headerRef.current.offsetHeight : 0
    };

    const closeButton = isDesktopXlScreen && (
        <Icon classes={{ root: desktopClasses.iconRoot }} src={IconClose} onClick={handleToggle} />
    );

    const restOfMessage = (
        <FormattedMessage id={'global.restof'} defaultMessage="Rest of {country}" values={{ country: websiteName }} />
    );

    return (
        <aside className={rootClassName} style={rootStyle}>
            <div className={classesToUse.body_masked}>
                <div>
                    <div className={classesToUse.heading}>
                        <FormattedMessage id={'global.deliveryCity'} defaultMessage={'Select delivery city'} />
                        {closeButton}
                    </div>
                    <div className={classesToUse.content}>
                        {cityList.map((carrier, i) => {
                            return (
                                <div className={classesToUse.customLinkContainer} key={carrier.city}>
                                    <b
                                        role={'button'}
                                        tabIndex={i}
                                        className={classesToUse.customLink}
                                        onClick={() => {
                                            handleSelectCity(carrier.city);
                                            handleToggle();
                                        }}
                                        onKeyDown={() => {
                                            handleSelectCity(carrier.city);
                                            handleToggle();
                                        }}
                                    >
                                        {carrier.city === 'default' ? restOfMessage : carrier.city}
                                    </b>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </aside>
    );
};

CityModal.propTypes = {
    cityList: array,
    handleSelectCity: func
};

export default CityModal;
