import { func, string, any, array, shape } from 'prop-types';
import React, { useCallback } from 'react';

import defaultClasses from '@app/components/GeoIpPopUp/geoIpPopUp.module.css';
import { ArrowDown, ArrowUp } from '@app/components/Icons';
import Field from '@app/components/overrides/Field';
import Select from '@app/components/overrides/Select';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const DropDowns = ({
    items,
    selectedValue,
    dropDownClick,
    openDropDown,
    name,
    label,
    handleSwitch,
    enabled,
    divData,
    classes: propClasses
}) => {
    const classes = useStyle(defaultClasses, propClasses);

    const handleClick = useCallback(
        item => {
            handleSwitch(item);
        },
        [handleSwitch]
    );

    const arrowIcon =
        openDropDown === name ? (
            <ArrowUp className={classes.dropdownDown} />
        ) : (
            <ArrowDown className={classes.dropdownIcon} />
        );
    // Removed selected value from list
    const filteredItems = items.filter(item => item.key !== selectedValue.value);
    const handleDropdownClick = useCallback(
        name => {
            enabled && filteredItems.length > 0 && dropDownClick(name);
        },
        [enabled, filteredItems.length, dropDownClick]
    );

    if (!items || items.length < 1) return <Shimmer width="100%" height={3} />;

    const divItems = divData
        ? divData
        : filteredItems &&
          filteredItems.map(item => (
              <button
                  onClick={() => {
                      handleClick(item);
                  }}
                  type="button"
                  key={'item-' + item.key}
              >
                  {item.label}
              </button>
          ));

    return (
        <div>
            <div className={classes.selectRoot}>
                <Field id="label" label="Label">
                    <Select key={name + '-key'} field="dropdown" items={items} value={selectedValue.key} />
                </Field>
            </div>
            <div className={classes.dropdown}>
                <div
                    role="button"
                    className={
                        !enabled
                            ? classes.disabledLabel
                            : !selectedValue.label
                            ? classes.defaultLabel
                            : classes.activeLabel
                    }
                    onClick={() => {
                        handleDropdownClick(name);
                    }}
                    onKeyDown={() => {
                        handleDropdownClick(name);
                    }}
                    tabIndex={0}
                >
                    <span>{label}</span>
                    {items.length > 1 && arrowIcon}
                    {selectedValue && <div className={classes.selectedValue}>{selectedValue.label}</div>}
                </div>
                {openDropDown === name && <ul className={classes.dropdownWrapper}>{divItems}</ul>}
            </div>
        </div>
    );
};

DropDowns.propTypes = {
    selectedValue: any,
    dropDownClick: func,
    openDropDown: string,
    items: array,
    name: string,
    handleSwitch: func,
    enabled: any,
    label: any,
    divData: any,
    classes: shape({
        selectRoot: string,
        dropdown: string,
        dropdownWrapper: string,
        dropdownDown: string,
        dropdownIcon: string,
        defaultLabel: string,
        activeLabel: string,
        disabledLabel: string,
        selectedValue: string
    })
};

export default DropDowns;
