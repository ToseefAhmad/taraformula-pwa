import React from 'react';
import { useIntl } from 'react-intl';

import { useHeader } from '@app/components/overrides/Header/useHeader';
import { useStores } from '@app/hooks/useStores/useStores';

import HeaderItemDropdown from './headerItemDropdown';
import StoreSwitcherShimmer from './storeSwitcher.shimmer';
import SwitcherItem from './switcherItem';

const StoreSwitcher = () => {
    const { availableStores, currentGroupName, handleSwitchStore, defaultStores, currentStoreGroupCode } = useStores();
    const { translationReady } = useHeader();
    const { formatMessage } = useIntl();

    if (!availableStores || !translationReady || availableStores.size < 1) return <StoreSwitcherShimmer />;

    const stores = defaultStores
        .map(store => {
            const title = formatMessage({
                id: 'storeGroupCode.' + store.storeGroupCode,
                defaultMessage: store.storeGroupName
            });
            return {
                key: store.code,
                children: (
                    <SwitcherItem onClick={handleSwitchStore} option={store} storeTitle={title}>
                        {title}
                    </SwitcherItem>
                )
            };
        })
        .filter(Boolean);

    const translateCurrentGroupName = formatMessage({
        id: 'storeGroupCode.' + currentStoreGroupCode,
        defaultMessage: currentGroupName
    });

    return <HeaderItemDropdown items={stores} buttonText={translateCurrentGroupName} ariaLabel={currentGroupName} />;
};

export default StoreSwitcher;
