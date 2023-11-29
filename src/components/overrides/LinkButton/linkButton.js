import { oneOf, shape, string, node } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';

import defaultClasses from './linkButton.module.css';

/**
 * A component for link buttons.
 *
 * @typedef LinkButton
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a single link button.
 */
const LinkButton = props => {
    const { children, classes: propClasses, type, ...restProps } = props;
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <Button
            priority={'normal'}
            classes={{ root_normalPriority: classes.root, content: classes.content }}
            type={type}
            {...restProps}
        >
            {children}
        </Button>
    );
};

/**
 * Props for {@link Button}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * Button component.
 * @property {string} classes.root classes for root container
 * @property {string} type the type of the Button
 */
LinkButton.propTypes = {
    classes: shape({
        root: string
    }),
    children: node,
    type: oneOf(['button', 'reset', 'submit']).isRequired
};

LinkButton.defaultProps = {
    type: 'button'
};

export default LinkButton;
