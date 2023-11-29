import { func, object, node, string, bool } from 'prop-types';
import React, { useCallback } from 'react';

import classes from './switcherItem.module.css';

const SwitcherItem = ({ onClick, option, children, storeTitle, isArabicText }) => {
    const handleClick = useCallback(() => {
        onClick(option);
    }, [option, onClick]);

    const textFontFamily = isArabicText ? classes.arabicTitle : classes.title;

    return (
        <button className={classes.root} onClick={handleClick}>
            <span className={textFontFamily} title={storeTitle}>
                {children}
            </span>
        </button>
    );
};

SwitcherItem.propTypes = {
    onClick: func,
    option: object,
    children: node,
    storeTitle: string,
    isArabicText: bool
};

SwitcherItem.defaultProps = {
    isArabicText: false
};

export default SwitcherItem;
