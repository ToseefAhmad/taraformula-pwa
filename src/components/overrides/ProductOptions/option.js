import { arrayOf, func, number, object, oneOfType, shape, string } from 'prop-types';
import React, { useMemo } from 'react';

import { useOption } from '@magento/peregrine/lib/talons/ProductOptions/useOption';
import getOptionType from '@magento/venia-ui/lib/components/ProductOptions/getOptionType';
import SwatchList from '@magento/venia-ui/lib/components/ProductOptions/swatchList';

import classes from './option.module.css';
import TileList from './tileList';

const getItemKey = ({ value_index }) => value_index;

// That identifies an attribute as a swatch
const getListComponent = (attribute_code, values) => {
    const optionType = getOptionType({ attribute_code, values });

    return optionType === 'swatch' ? SwatchList : TileList;
};

const Option = props => {
    const { attribute_code, attribute_id, label, onSelectionChange, selectedValue, values } = props;

    const talonProps = useOption({
        attribute_id,
        label,
        onSelectionChange,
        selectedValue,
        values
    });

    const { handleSelectionChange, initialSelection } = talonProps;

    const ValueList = useMemo(() => getListComponent(attribute_code, values), [attribute_code, values]);

    return (
        <div className={classes.root}>
            <ValueList
                getItemKey={getItemKey}
                selectedValue={initialSelection}
                items={values}
                onSelectionChange={handleSelectionChange}
                label={label}
            />
        </div>
    );
};

Option.propTypes = {
    attribute_code: string.isRequired,
    attribute_id: string,
    classes: shape({
        root: string,
        title: string
    }),
    label: string.isRequired,
    onSelectionChange: func,
    selectedValue: oneOfType([number, string]),
    values: arrayOf(object).isRequired
};

export default Option;
