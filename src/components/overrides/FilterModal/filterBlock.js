import { Form } from 'informed';
import { arrayOf, shape, string, func, bool } from 'prop-types';
import React from 'react';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';
import { useIntl } from 'react-intl';

import { useFilterBlock } from '@magento/peregrine/lib/talons/FilterModal';
import setValidator from '@magento/peregrine/lib/validators/set';
import FilterList from '@magento/venia-ui/lib/components/FilterModal/FilterList';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './filterBlock.module.css';

const FilterBlock = props => {
    const { filterApi, filterState, group, items, name, onApply, initialOpen } = props;

    const { formatMessage } = useIntl();
    const talonProps = useFilterBlock({
        filterState,
        items,
        initialOpen
    });
    const { handleClick, isExpanded } = talonProps;
    const iconSrc = isExpanded ? ArrowUp : ArrowDown;

    const itemAriaLabel = formatMessage(
        {
            id: 'filterModal.item.ariaLabel',
            defaultMessage: 'Filter products by'
        },
        {
            itemName: name
        }
    );

    const toggleItemOptionsAriaLabel = isExpanded
        ? formatMessage(
              {
                  id: 'filterModal.item.hideOptions',
                  defaultMessage: 'Hide filter item options.'
              },
              {
                  itemName: name
              }
          )
        : formatMessage(
              {
                  id: 'filterModal.item.showOptions',
                  defaultMessage: 'Show filter item options.'
              },
              {
                  itemName: name
              }
          );

    const list = isExpanded && (
        <Form className={classes.list}>
            <FilterList filterApi={filterApi} filterState={filterState} group={group} items={items} onApply={onApply} />
        </Form>
    );

    return (
        <li className={classes.root} aria-label={itemAriaLabel}>
            <button
                className={classes.trigger}
                onClick={handleClick}
                type="button"
                aria-expanded={isExpanded}
                aria-label={toggleItemOptionsAriaLabel}
            >
                <span className={classes.header}>
                    <span className={classes.name}>{name}</span>
                    <Icon src={iconSrc} size={15} />
                </span>
            </button>
            {list}
        </li>
    );
};

FilterBlock.defaultProps = {
    onApply: null,
    initialOpen: false
};

FilterBlock.propTypes = {
    classes: shape({
        header: string,
        list: string,
        name: string,
        root: string,
        trigger: string
    }),
    filterApi: shape({}).isRequired,
    filterState: setValidator,
    group: string.isRequired,
    items: arrayOf(shape({})),
    name: string.isRequired,
    onApply: func,
    initialOpen: bool
};

export default FilterBlock;
