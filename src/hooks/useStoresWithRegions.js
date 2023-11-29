import React, { useEffect, useRef } from 'react';

import { AE, AU, BH, DZ, IN, JO, KW, OM, QA, SA, UK, US } from '@app/components/Icons';
import classes from '@app/components/overrides/Header/headerItemDropdown.module.css';
import Icon from '@magento/venia-ui/lib/components/Icon';

export const useStoresWithRegions = (items, iconClasses) => {
    // Data
    const middleEastAndAsiaItems = useRef([]);
    const restOfTheWorldItems = useRef([]);

    // Middle east and asia store codes. All the rest are in rest of the world category
    const middleEastAndAsiaStoreGroupCode = ['AE', 'BH', 'DZ', 'IN', 'JO', 'KW', 'OM', 'QA', 'SA'];

    // Store code mapping to icons
    const flagComponents = {
        DZ: DZ,
        AE: AE,
        AU: AU,
        UK: UK,
        BH: BH,
        IN: IN,
        KW: KW,
        OM: OM,
        US: US,
        SA: SA,
        QA: QA,
        JO: JO
    };

    // Functions

    // Divide stores to regions
    const mapStores = storesArray =>
        storesArray.map(item => {
            const flagComponent = flagComponents[item.children.props.option.storeGroupCode];
            const flagIcon = flagComponent ? (
                <Icon src={flagComponent} classes={iconClasses} />
            ) : (
                <div style={{ width: 25 }} />
            );

            return (
                <li className={classes.menuItem} key={item.key}>
                    {flagIcon}
                    {item.children}
                </li>
            );
        });

    // Effects
    useEffect(() => {
        for (const item of Object.values(items)) {
            middleEastAndAsiaStoreGroupCode.includes(item.children.props.option.storeGroupCode)
                ? middleEastAndAsiaItems.current.push(item)
                : restOfTheWorldItems.current.push(item);
        }

        middleEastAndAsiaItems.current = mapStores(middleEastAndAsiaItems.current);
        restOfTheWorldItems.current = mapStores(restOfTheWorldItems.current);
        // NOTE: Run effect once on component mount, please recheck dependencies if effect is updated.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        middleEastAndAsiaItems,
        restOfTheWorldItems
    };
};
