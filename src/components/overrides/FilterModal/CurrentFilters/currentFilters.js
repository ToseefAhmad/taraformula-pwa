import PropType, { func, shape, string } from 'prop-types';
import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';

import CurrentFilter from './currentFilter';
import classes from './currentFilters.module.css';

const CurrentFilters = props => {
    const { filterApi, filterState, onRemove } = props;
    const { removeItem } = filterApi;
    const { formatMessage } = useIntl();
    // Create elements and params at the same time for efficiency
    const filterElements = useMemo(() => {
        const elements = [];
        for (const [group, items] of filterState) {
            for (const item of items) {
                const { title, value } = item || {};
                const key = `${group}::${title}_${value}`;

                elements.push(
                    <li key={key} className={classes.item}>
                        <CurrentFilter group={group} item={item} removeItem={removeItem} onRemove={onRemove} />
                    </li>
                );
            }
        }

        return elements;
    }, [filterState, removeItem, onRemove]);

    const currentFiltersAriaLabel = formatMessage({
        id: 'filterModal.currentFilters.ariaLabel',
        defaultMessage: 'Current Filters'
    });

    return (
        <ul className={classes.root} aria-label={currentFiltersAriaLabel}>
            {filterElements}
        </ul>
    );
};

CurrentFilters.defaultProps = {
    onRemove: null
};

CurrentFilters.propTypes = {
    classes: shape({
        root: string,
        item: string,
        button: string,
        icon: string
    }),
    onRemove: func,
    filterApi: shape({
        addItem: func,
        clear: func,
        dispatch: func,
        removeItem: func,
        setItems: func,
        toggleItem: func
    }),
    filterState: PropType.oneOfType([PropType.func, PropType.object])
};

export default CurrentFilters;
