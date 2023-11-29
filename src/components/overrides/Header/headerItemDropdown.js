import { arrayOf, node, oneOfType, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Cross } from '@app/components/Icons';
import { useStoresWithRegions } from '@app/hooks/useStoresWithRegions';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './headerItemDropdown.module.css';
import { useHeaderItemDropdown } from './useHeaderItemDropdown';

const HeaderItemDropdown = ({ items, buttonText, ariaLabel = null }) => {
    const iconClasses = { icon: classes.iconIcon, root: classes.iconRoot };

    const { middleEastAndAsiaItems, restOfTheWorldItems } = useStoresWithRegions(items, iconClasses);
    const { storeMenuRef: menuRef, storeMenuTriggerRef, storeMenuIsOpen, handleTriggerClick } = useHeaderItemDropdown();

    const menu = storeMenuIsOpen && (
        <div ref={menuRef} className={classes.menuContainer}>
            <h2 className={classes.menuTitle}>
                <FormattedMessage id={'storeSwitcher.selectRegionMessage'} defaultMessage={'Select your Region'} />
            </h2>
            <button className={classes.menuClose} onClick={handleTriggerClick}>
                <Icon src={Cross} size={15} />
            </button>
            <div className={classes.menuRegionsContainer}>
                <div className={classes.menuRegionContainer}>
                    <div className={classes.regionTitle}>
                        <FormattedMessage
                            id={'storeSwitcher.regions.middleEastAndAsia'}
                            defaultMessage={'Middle East and Asia'}
                        />
                    </div>
                    <ul> {middleEastAndAsiaItems.current} </ul>
                </div>
                <div className={classes.menuVerticalSeparator} />
                <div className={classes.menuRegionContainer}>
                    <div className={classes.regionTitle}>
                        <FormattedMessage
                            id={'storeSwitcher.regions.restOfTheWorld'}
                            defaultMessage={'Rest of the World'}
                        />
                    </div>
                    <ul>{restOfTheWorldItems.current}</ul>
                </div>
            </div>
        </div>
    );

    const triggerClasses = storeMenuIsOpen ? classes.triggerActive : classes.trigger;

    return (
        <div>
            <button
                ref={storeMenuTriggerRef}
                className={triggerClasses}
                {...ariaLabel && { 'aria-label': ariaLabel }}
                onClick={handleTriggerClick}
                title={buttonText}
            >
                {buttonText}
            </button>
            {menu}
        </div>
    );
};

export default HeaderItemDropdown;

HeaderItemDropdown.propTypes = {
    buttonText: string.isRequired,
    ariaLabel: string,
    items: arrayOf(
        shape({
            key: string,
            children: oneOfType([arrayOf(node), node])
        })
    )
};
