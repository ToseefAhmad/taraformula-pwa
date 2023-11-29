import PropTypes, { arrayOf, node, oneOfType, shape, string } from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { AE, AU, ChevronDown, DZ, IN, JO, KW, OM, QA, SA, UK, US } from '@app/components/Icons';
import BH from '@app/components/Icons/icons/BH';
import minusFull from '@app/components/Icons/icons/minusFull';
import ThinPlus from '@app/components/Icons/icons/thinPlus';
import StoreSwitcherNavTrigger from '@app/components/overrides/Header/storeSwitcherNavTrigger';
import { useStoresWithRegions } from '@app/hooks/useStoresWithRegions';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon/icon';

import defaultClasses from './navigationItemDropdown.module.css';

const NavigationItemDropdown = ({
    items,
    buttonText,
    ariaLabel = null,
    propsClasses,
    toggleSelectingCountry,
    selectingCountry,
    closeAllNavigation,
    currentStoreGroupCode
}) => {
    const classes = useStyle(defaultClasses, propsClasses);
    const iconClasses = { icon: classes.iconIcon, root: '' };
    const flagIconsClasses = { icon: '', root: classes.iconRoot };
    const { middleEastAndAsiaItems, restOfTheWorldItems } = useStoresWithRegions(items, flagIconsClasses);

    const [regionOpen, setRegionOpen] = useState(null);
    const Regions = {
        MiddleEastAndAsia: 'middleEastAndAsia',
        RestOfTheWorld: 'restOfTheWorld'
    };
    const changeOpenRegion = region => {
        if (regionOpen === region) {
            setRegionOpen(null);
        } else {
            setRegionOpen(region);
        }
    };

    const middleEastAndAsiaCountriesClass =
        regionOpen === Regions.MiddleEastAndAsia ? classes.countriesContainerOpen : classes.countriesContainer;
    const restOfTheWorldClass =
        regionOpen === Regions.RestOfTheWorld ? classes.countriesContainerOpen : classes.countriesContainer;

    const navTrigger = selectingCountry && (
        <StoreSwitcherNavTrigger
            toggleSelectingCountry={toggleSelectingCountry}
            closeAllNavigation={closeAllNavigation}
        />
    );

    const openTriggerMiddleEastAndAsia =
        regionOpen === Regions.MiddleEastAndAsia ? (
            <Icon classes={iconClasses} src={minusFull} />
        ) : (
            <Icon classes={iconClasses} src={ThinPlus} />
        );
    const openTriggerRestOfTheWorld =
        regionOpen === Regions.RestOfTheWorld ? (
            <Icon classes={iconClasses} src={minusFull} />
        ) : (
            <Icon classes={iconClasses} src={ThinPlus} />
        );
    // Const menu = storeMenuIsOpen && <ul className={classes.menu}>{menuItems}</ul>;
    const menu = selectingCountry && (
        <>
            <div className={classes.storeMenuRegions}>
                {navTrigger}
                <p className={classes.menuTitle}>
                    <FormattedMessage id={'storeSwitcher.selectRegionMessage'} defaultMessage={'Select your Region'} />
                </p>
                <hr className={classes.horizontalSeparator} />
                <p className={classes.regionTitle}>
                    <FormattedMessage
                        id={'storeSwitcher.regions.middleEastAndAsia'}
                        defaultMessage={'Middle East and Asia'}
                    />
                    <button onClick={() => changeOpenRegion(Regions.MiddleEastAndAsia)}>
                        {openTriggerMiddleEastAndAsia}
                    </button>
                </p>
                <ul className={middleEastAndAsiaCountriesClass}> {middleEastAndAsiaItems.current} </ul>
                <hr className={classes.horizontalSeparator} />
                <p className={classes.regionTitle}>
                    <FormattedMessage
                        id={'storeSwitcher.regions.restOfTheWorld'}
                        defaultMessage={'Rest of the World'}
                    />
                    <button onClick={() => changeOpenRegion(Regions.RestOfTheWorld)}>
                        {openTriggerRestOfTheWorld}
                    </button>
                </p>
                <ul className={restOfTheWorldClass}> {restOfTheWorldItems.current} </ul>
                <hr className={classes.horizontalSeparator} />
            </div>
            ;
        </>
    );

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

    const flagComponent = flagComponents[currentStoreGroupCode];
    return (
        <div className={classes.root}>
            <button
                className={selectingCountry ? classes.triggerOpen : classes.trigger}
                {...ariaLabel && { 'aria-label': ariaLabel }}
                onClick={toggleSelectingCountry}
            >
                <div className={classes.countryTextFlagContainer}>
                    {flagComponent && <Icon size={20} src={flagComponent} className={classes.iconFlag} />}
                    {buttonText}
                </div>
                <Icon size={15} src={ChevronDown} className={classes.iconClosed} />
            </button>
            {menu}
        </div>
    );
};

export default NavigationItemDropdown;

NavigationItemDropdown.propTypes = {
    propsClasses: PropTypes.shape({
        menu: PropTypes.string,
        triggerOpen: PropTypes.string,
        menuItem: PropTypes.string
    }),
    buttonText: string.isRequired,
    ariaLabel: string,
    items: arrayOf(
        shape({
            key: string,
            children: oneOfType([arrayOf(node), node])
        })
    ),
    toggleSelectingCountry: PropTypes.func,
    selectingCountry: PropTypes.bool,
    closeAllNavigation: PropTypes.func,
    currentStoreGroupCode: PropTypes.string
};
