import { array, arrayOf, shape, string, oneOf } from 'prop-types';
import React, { useMemo, useCallback } from 'react';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import Button from '../Button';
import Icon from '../Icon';

import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

import classes from './productSort.module.css';
import SortItem from './sortItem';

const ProductSort = props => {
    const { availableSortMethods, sortProps } = props;
    const [currentSort, setSort] = sortProps;
    const { elementRef, expanded, setExpanded } = useDropdown();

    // Click event for menu items
    const handleItemClick = useCallback(
        sortAttribute => {
            setSort({
                sortText: sortAttribute.text,
                sortId: sortAttribute.id,
                sortAttribute: sortAttribute.attribute,
                sortDirection: sortAttribute.sortDirection
            });
            setExpanded(false);
        },
        [setExpanded, setSort]
    );

    const sortElements = useMemo(() => {
        // Should be not render item in collapsed mode.
        if (!expanded) {
            return null;
        }

        const itemElements = Array.from(availableSortMethods, sortItem => {
            const { attribute, sortDirection } = sortItem;
            const isActive = currentSort.sortAttribute === attribute && currentSort.sortDirection === sortDirection;

            const key = `${attribute}--${sortDirection}`;
            return (
                <li key={key} className={classes.menuItem}>
                    <SortItem sortItem={sortItem} active={isActive} onClick={handleItemClick} />
                </li>
            );
        });

        return (
            <div className={classes.menu}>
                <ul>{itemElements}</ul>
            </div>
        );
    }, [availableSortMethods, currentSort.sortAttribute, currentSort.sortDirection, expanded, handleItemClick]);

    // Expand or collapse on click
    const handleSortClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div ref={elementRef} className={classes.root} aria-live="polite" aria-busy="false">
            <Button
                priority={'low'}
                classes={{
                    root_lowPriority: classes.sortButton,
                    content: classes.buttonContent
                }}
                onClick={handleSortClick}
            >
                <span className={classes.mobileText}>
                    <FormattedMessage id={'productSort.sortButton'} defaultMessage={'Sort'} />
                </span>
                <span className={classes.desktopText}>
                    <span className={classes.sortText}>
                        <FormattedMessage id={'productSort.sortByButton'} defaultMessage={'Sort by'} />
                        &nbsp;
                        <span className={classes.sortValue}>{currentSort.sortText}</span>
                    </span>
                    <Icon
                        src={!expanded ? ArrowDown : ArrowUp}
                        classes={{
                            root: classes.desktopIconWrapper,
                            icon: classes.desktopIcon
                        }}
                    />
                </span>
            </Button>
            {sortElements}
        </div>
    );
};

const sortDirections = oneOf(['ASC', 'DESC']);

ProductSort.propTypes = {
    classes: shape({
        menuItem: string,
        menu: string,
        root: string,
        sortButton: string
    }),
    availableSortMethods: arrayOf(
        shape({
            text: string,
            id: string,
            attribute: string,
            sortDirection: sortDirections
        })
    ),
    sortProps: array
};

ProductSort.defaultProps = {
    availableSortMethods: [
        {
            text: 'Position',
            id: 'sortItem.position',
            attribute: 'position',
            sortDirection: 'ASC'
        },
        {
            id: 'sortItem.relevance',
            text: 'Best Match',
            attribute: 'relevance',
            sortDirection: 'DESC'
        },
        {
            id: 'sortItem.priceAsc',
            text: 'Price: Low to High',
            attribute: 'price',
            sortDirection: 'ASC'
        },
        {
            id: 'sortItem.priceDesc',
            text: 'Price: High to Low',
            attribute: 'price',
            sortDirection: 'DESC'
        }
    ]
};

export default ProductSort;
