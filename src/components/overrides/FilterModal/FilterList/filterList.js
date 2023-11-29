import { array, shape, string, func, number } from 'prop-types';
import React, { Fragment, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useFilterList } from '@magento/peregrine/lib/talons/FilterModal';
import setValidator from '@magento/peregrine/lib/validators/set';

import FilterItem from './filterItem';
import classes from './filterList.module.css';

const labels = new WeakMap();

const FilterList = props => {
    const { filterApi, filterState, group, itemCountToShow, items, onApply } = props;
    const talonProps = useFilterList({ filterState, items, itemCountToShow });
    const { isListExpanded, handleListToggle } = talonProps;
    const { formatMessage } = useIntl();

    // Memoize item creation
    // Search value is not referenced, so this array is stable
    const itemElements = useMemo(
        () =>
            items.map((item, index) => {
                const { title, value } = item;
                const key = `item-${group}-${value}`;

                if (!isListExpanded && index >= itemCountToShow) {
                    return null;
                }

                // Create an element for each item
                const element = (
                    <li key={key} className={classes.item}>
                        <FilterItem
                            filterApi={filterApi}
                            filterState={filterState}
                            group={group}
                            item={item}
                            onApply={onApply}
                        />
                    </li>
                );

                // Associate each element with its normalized title
                // Titles are not unique, so use the element as the key
                labels.set(element, title.toUpperCase());

                return element;
            }),
        [filterApi, filterState, group, items, isListExpanded, itemCountToShow, onApply]
    );

    const showMoreLessItem = useMemo(() => {
        if (items.length <= itemCountToShow) {
            return null;
        }

        const label = isListExpanded
            ? formatMessage({
                  id: 'filterList.showLess',
                  defaultMessage: 'Show Less'
              })
            : formatMessage({
                  id: 'filterList.showMore',
                  defaultMessage: 'Show More'
              });

        return (
            <li className={classes.showMoreLessItem}>
                <button onClick={handleListToggle} className={classes.showMoreLessButton}>
                    {label}
                </button>
            </li>
        );
    }, [isListExpanded, handleListToggle, items, itemCountToShow, formatMessage]);

    return (
        <Fragment>
            <ul className={classes.items}>
                {itemElements}
                {showMoreLessItem}
            </ul>
        </Fragment>
    );
};

FilterList.defaultProps = {
    onApply: null,
    itemCountToShow: 5
};

FilterList.propTypes = {
    classes: shape({
        item: string,
        items: string
    }),
    filterApi: shape({}),
    filterState: setValidator,
    group: string,
    items: array,
    onApply: func,
    itemCountToShow: number
};

export default FilterList;
