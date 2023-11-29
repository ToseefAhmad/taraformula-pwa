import { node, string, object, oneOfType } from 'prop-types';
import React, { useCallback } from 'react';

import { Plus as PlusIcon, Minus as MinusIcon } from '@app/components/Icons';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import { useAccordionContext } from './accordion';
import defaultClasses from './section.module.css';

const Section = ({ children, id, title, subtitle, ...props }) => {
    const { handleSectionToggle, openSectionIds } = useAccordionContext();

    const handleSectionToggleWithId = useCallback(() => handleSectionToggle(id), [handleSectionToggle, id]);

    const classes = useStyle(defaultClasses, props.classes);

    const isOpen = openSectionIds.has(id);
    const titleIconSrc = isOpen ? MinusIcon : PlusIcon;
    const titleIcon = <Icon classes={{ icon: classes.icon }} src={titleIconSrc} />;

    const contentsContainerClass = isOpen ? classes.contents_container : classes.contents_container_closed;

    return (
        <div className={classes.root}>
            <button className={classes.title_container} onClick={handleSectionToggleWithId} type="button">
                <span className={classes.title_wrapper}>
                    <span className={classes.title}>{title}</span>
                    {titleIcon}
                </span>
                <span className={classes.subtitle}>{subtitle}</span>
            </button>
            <div className={contentsContainerClass}>{children}</div>
        </div>
    );
};

Section.propTypes = {
    classes: object,
    children: node,
    id: string,
    title: oneOfType([object, string]),
    subtitle: object
};

export default Section;
