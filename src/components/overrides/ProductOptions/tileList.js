import { arrayOf, func, object, shape, string } from 'prop-types';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import DropDowns from '@app/components/GeoIpPopUp/dropdowns';
import { useGeoIpPopUp } from '@app/components/GeoIpPopUp/useGeoIpPopUp';
import Tile from '@magento/venia-ui/lib/components/ProductOptions/tile';

import classes from './option.module.css';

const TileList = props => {
    const { getItemKey, selectedValue = {}, items, onSelectionChange, label } = props;
    const { formatMessage } = useIntl();
    const { openDropDown, dropDownClick, handleCloseDropDown } = useGeoIpPopUp();

    const itemData = useMemo(
        () =>
            items.map(item => {
                return {
                    key: getItemKey(item),
                    label: item.store_label,
                    value: item.label,
                    uid: item.uid,
                    value_index: item.value_index
                };
            }),
        [getItemKey, items]
    );

    const tiles = useMemo(
        () =>
            items.map(item => {
                const isSelected = item.label === selectedValue.label;
                return (
                    <Tile
                        key={getItemKey(item)}
                        isSelected={isSelected}
                        item={item}
                        onClick={() => {
                            onSelectionChange(item.value_index);
                            handleCloseDropDown();
                        }}
                    />
                );
            }),
        [getItemKey, selectedValue.label, items, onSelectionChange, handleCloseDropDown]
    );

    return (
        <div className={classes.confOptions}>
            <DropDowns
                items={itemData}
                selectedValue={selectedValue}
                dropDownClick={dropDownClick}
                openDropDown={openDropDown}
                name="productOption"
                label={formatMessage(
                    {
                        id: 'configurableProducts.attributeSelect',
                        defaultMessage: `Choose your {label}`
                    },
                    { label: label }
                )}
                enabled={true}
                divData={tiles}
                classes={{ defaultLabel: classes.defaultLabel }}
            />
        </div>
    );
};

TileList.propTypes = {
    classes: shape({
        root: string,
        defaultLabel: string
    }),
    getItemKey: func,
    selectedValue: object,
    items: arrayOf(object),
    onSelectionChange: func,
    label: string
};

TileList.displayName = 'TileList';

export default TileList;
