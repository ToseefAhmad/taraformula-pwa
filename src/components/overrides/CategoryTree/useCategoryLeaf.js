import { useCallback } from 'react';

/**
 * Returns props necessary to render a CategoryLeaf component.
 *
 * @param {object} props
 * @param {function} props.onNavigate - callback to fire on link click
 * @return {{ handleClick: function }}
 */
const useCategoryLeaf = props => {
    const { onNavigate } = props;

    const handleClick = useCallback(() => {
        onNavigate();
    }, [onNavigate]);

    return {
        handleClick
    };
};

export default useCategoryLeaf;
