import { bool, func, shape, string } from 'prop-types';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './sortItem.module.css';

const SortItem = props => {
    const { active, onClick, sortItem } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const handleClick = useCallback(() => {
        onClick(sortItem);
    }, [sortItem, onClick]);

    const text = `${classes.text} ${active ? classes.isActive : ''}`;

    return (
        <button className={classes.root} onClick={handleClick}>
            <span className={classes.content}>
                <span className={text}>
                    <FormattedMessage id={sortItem.id} defaultMessage={sortItem.text} />
                </span>
            </span>
        </button>
    );
};

SortItem.propTypes = {
    active: bool,
    classes: shape({
        content: string,
        root: string,
        text: string
    }),
    onClick: func,
    sortItem: shape({
        attribute: string,
        id: string,
        sortDirection: string,
        text: string
    })
};

export default SortItem;
