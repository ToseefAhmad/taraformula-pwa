import { bool, func, shape, string } from 'prop-types';
import React from 'react';

import { Cross } from '@app/components/Icons';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from '@magento/venia-ui/lib/components/LegacyMiniCart/section.module.css';

const Section = ({ isFilled, onClick, text, classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);
    const iconClasses = { root: classes.icon };

    if (isFilled) {
        iconClasses.root = classes.icon_filled;
    }

    return (
        <li className={classes.menuItem}>
            <button onMouseDown={onClick}>
                <span className={classes.text}>{text}</span>
                <Icon classes={{ root: classes.iconContainer, icon: classes.icon }} src={Cross} size={16} />
            </button>
        </li>
    );
};

Section.propTypes = {
    classes: shape({
        iconContainer: string,
        icon: string,
        menuItem: string,
        text: string
    }),
    isFilled: bool,
    onClick: func,
    text: string
};

export default Section;
