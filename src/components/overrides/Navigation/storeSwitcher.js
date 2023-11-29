import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStores } from '@app/hooks/useStores/useStores';

import NavigationItemDropdown from './navigationItemDropdown';
import StoreSwitcherShimmer from './storeSwitcher.shimmer';
import SwitcherItem from './switcherItem';

const StoreSwitcher = ({ toggleSelectingCountry, selectingCountry, closeAllNavigation }) => {
    const { formatMessage } = useIntl();
    const {
        availableStores,
        currentGroupName,
        currentStoreName,
        handleSwitchStore,
        defaultStores,
        currentStoreGroupCode
    } = useStores();

    if (!availableStores) return <StoreSwitcherShimmer />;

    if (availableStores.size <= 1) return null;

    const stores = defaultStores
        .map(store => ({
            key: store.code,
            children: (
                <SwitcherItem onClick={handleSwitchStore} option={store}>
                    <FormattedMessage
                        id={'storeGroupCode.' + store.storeGroupCode}
                        defaultMessage={store.storeGroupName}
                    />
                </SwitcherItem>
            )
        }))
        .filter(Boolean);

    const translateCurrentGroupName = formatMessage({
        id: 'storeGroupCode.' + currentStoreGroupCode,
        defaultMessage: currentGroupName
    });

    return (
        <NavigationItemDropdown
            items={stores}
            buttonText={translateCurrentGroupName}
            currentStoreGroupCode={currentStoreGroupCode}
            ariaLabel={currentStoreName}
            toggleSelectingCountry={toggleSelectingCountry}
            selectingCountry={selectingCountry}
            closeAllNavigation={closeAllNavigation}
        />
    );
};

export default StoreSwitcher;

StoreSwitcher.propTypes = {
    toggleSelectingCountry: PropTypes.func,
    selectingCountry: PropTypes.bool,
    closeAllNavigation: PropTypes.func
};
