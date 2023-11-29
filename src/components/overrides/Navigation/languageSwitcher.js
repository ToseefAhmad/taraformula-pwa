import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useStores } from '@app/hooks/useStores/useStores';

import classes from './languageSwitcher.module.css';
import NavigationItemDropdown from './navigationItemDropdown';
import Shimmer from './storeSwitcher.shimmer';
import SwitcherItem from './switcherItem';

const ARABIC_LANG_REGEX = /[\u0600-\u06FF]/;

const LanguageSwitcher = () => {
    const { currentStoreName, handleSwitchStore, currentGroupStores } = useStores();
    const { formatMessage } = useIntl();

    if (!currentGroupStores || currentGroupStores.length < 1) return <Shimmer />;
    const switchToStore =
        currentGroupStores.filter(store => !store.isCurrent).length > 0
            ? currentGroupStores.filter(store => !store.isCurrent)[0]
            : [];
    const stores = currentGroupStores
        .map(
            store =>
                !store.isCurrent && {
                    key: store.code,
                    children: (
                        <SwitcherItem onClick={handleSwitchStore} option={store}>
                            <FormattedMessage
                                id={'storeName.' + store.storeName.toLowerCase()}
                                defaultMessage={store.storeName}
                            />
                        </SwitcherItem>
                    )
                }
        )
        .filter(Boolean);

    // In cases webpage has more than two languages
    if (stores.length > 1) {
        return (
            <NavigationItemDropdown
                ariaLabel={currentStoreName}
                buttonText={formatMessage({
                    id: 'storeName.' + currentStoreName.toLowerCase(),
                    defaultMessage: currentStoreName
                })}
                items={stores}
                propsClasses={{
                    menu: classes.dropdownMenu,
                    triggerOpen: classes.dropdownTriggerOpen,
                    menuItem: classes.dropdownMenuItem
                }}
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
                <div className={classes.trigger}>
                    <SwitcherItem onClick={handleSwitchStore} option={switchToStore} isArabicText={isArabicText}>
                        <FormattedMessage
                            id={'storeName.' + switchToStore.storeName.toLowerCase()}
                            defaultMessage={switchToStore.storeName}
                        />
                    </SwitcherItem>
                </div>
            );
        })()
    );
};

export default LanguageSwitcher;
