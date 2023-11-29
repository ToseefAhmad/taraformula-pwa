import { bool, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import Checkbox from '@app/components/overrides/Checkbox';

import classes from './filterDefault.module.css';

const FilterDefault = props => {
    const { isSelected, item, ...restProps } = props;

    const { label, value_index } = item || {};
    const { formatMessage } = useIntl();

    const ariaLabel = !isSelected
        ? formatMessage(
              {
                  id: 'filterModal.item.applyFilter',
                  defaultMessage: 'Apply filter'
              },
              {
                  optionName: label
              }
          )
        : formatMessage(
              {
                  id: 'filterModal.item.clearFilter',
                  defaultMessage: 'Remove filter'
              },
              {
                  optionName: label
              }
          );

    return (
        <Checkbox
            classes={classes}
            field={`${label}-${value_index}`}
            fieldValue={!!isSelected}
            label={label}
            ariaLabel={ariaLabel}
            {...restProps}
        />
    );
};

export default FilterDefault;

FilterDefault.propTypes = {
    classes: shape({
        root: string,
        icon: string,
        label: string,
        checked: string
    }),
    group: string,
    isSelected: bool,
    item: shape({
        label: string.isRequired,
        value_index: string.isRequired
    }).isRequired,
    label: string
};
