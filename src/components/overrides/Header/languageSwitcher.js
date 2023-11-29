import React from 'react';
import { useIntl } from 'react-intl';

import { useHeader } from '@app/components/overrides/Header/useHeader';
import { useStores } from '@app/hooks/useStores/useStores';

import HeaderItemDropdown from './headerItemDropdown';
import classes from './headerItemDropdown.module.css';
import Shimmer from './storeSwitcher.shimmer';
import SwitcherItem from './switcherItem';

const ARABIC_LANG_REGEX = /[\u0600-\u06FF]/;

const LanguageSwitcher = () => {
    const { currentStoreName, handleSwitchStore, currentGroupStores } = useStores();
    const { formatMessage } = useIntl();
    const { translationReady } = useHeader();

    if (!currentGroupStores || !translationReady || currentGroupStores.length < 1) return <Shimmer />;
    const switchToStore =
        currentGroupStores.filter(store => !store.isCurrent).length > 0
            ? currentGroupStores.filter(store => !store.isCurrent)[0]
            : [];
    const stores = currentGroupStores
        .map(store => {
            const storeName = formatMessage({
                id: 'storeName.' + store.storeName.toLowerCase(),
                defaultMessage: store.storeName
            });
            !store.isCurrent && {
                key: store.code,
                children: (
                    <SwitcherItem onClick={handleSwitchStore} option={store} storeTitle={storeName}>
                        {storeName}
                    </SwitcherItem>
                )
            };
        })
        .filter(Boolean);

    // In cases webpage has more than two languages
    if (stores.length > 1) {
        return (
            <HeaderItemDropdown
                ariaLabel={currentStoreName}
                buttonText={formatMessage({
                    id: 'storeName.' + currentStoreName.toLowerCase(),
                    defaultMessage: currentStoreName
                })}
                items={stores}
            />
        );
    }

    return (
        switchToStore &&
        'code' in switchToStore &&
        (() => {
            const storeName = formatMessage({
                id: 'storeName.' + switchToStore.storeName.toLowerCase(),
                defaultMessage: switchToStore.storeName
            });

            const isArabicText = ARABIC_LANG_REGEX.test(storeName);

            return (
                <div className={classes.menuItem}>
                    <SwitcherItem
                        isArabicText={isArabicText}
                        onClick={handleSwitchStore}
                        option={switchToStore}
                        storeTitle={storeName}
                    >
                        {storeName}
                    </SwitcherItem>
                </div>
            );
        })()
    );
};

export default LanguageSwitcher;
