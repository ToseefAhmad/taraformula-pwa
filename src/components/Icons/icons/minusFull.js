import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const MinusFull = forwardRef(({ color = 'currentColor', size = 15, ...rest }, ref) => {
    return (
        <svg ref={ref} width={size} height={size / 15} viewBox="0 0 15 1" fill="none" {...rest}>
            <rect width="15" height="1" rx="0.5" fill={color} />
        </svg>
    );
});

MinusFull.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

MinusFull.displayName = 'MinusFull';

export default MinusFull;
