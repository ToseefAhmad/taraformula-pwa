import { func, object, node, bool } from 'prop-types';
import React, { useCallback } from 'react';

import classes from './switcherItem.module.css';

const SwitcherItem = ({ onClick, option, children, isArabicText }) => {
    const handleClick = useCallback(() => {
        onClick(option);
    }, [option, onClick]);

    const buttonStyle = isArabicText ? classes.arabicRoot : classes.root;

    return (
        <button className={buttonStyle} onClick={handleClick}>
            {children}
        </button>
    );
};

SwitcherItem.propTypes = {
    onClick: func,
    option: object,
    children: node,
    isArabicText: bool
};

SwitcherItem.defaultProps = {
    isArabicText: false
};

export default SwitcherItem;
