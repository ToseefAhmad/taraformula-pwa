import { bool, node, shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './field.module.css';

const Field = props => {
    const { children, label, optional, ...rest } = props;
    const classes = useStyle(defaultClasses, props.classes);

    let childrenWithLabel = children;
    if (label) {
        childrenWithLabel =
            children instanceof Array
                ? (childrenWithLabel = children.map((c, index) =>
                      c ? React.cloneElement(c, { label, optional, key: index, ...rest }) : c
                  ))
                : (childrenWithLabel = React.cloneElement(children, { label, optional, ...rest }));
    }

    return <div className={classes.root}>{childrenWithLabel}</div>;
};

Field.propTypes = {
    children: node,
    classes: shape({
        root: string
    }),
    label: string,
    optional: bool
};

export default Field;
