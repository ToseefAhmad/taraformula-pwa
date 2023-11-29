import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const PlusFull = forwardRef(({ color = 'currentColor', size = 15, ...rest }, ref) => {
    return (
        <svg ref={ref} width={size} height={size} viewBox="0 0 15 15" fill="none" {...rest}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.5 0C7.22363 0 7 0.223633 7 0.5V7H0.5C0.223633 7 0 7.22363 0 7.5C0 7.77637 0.223633 8 0.5 8H7V14.5C7 14.7764 7.22363 15 7.5 15C7.77637 15 8 14.7764 8 14.5V8H14.5C14.6294 8 14.7476 7.95068 14.8364 7.87012C14.937 7.77881 15 7.64697 15 7.5C15 7.22363 14.7764 7 14.5 7H8V0.5C8 0.223633 7.77637 0 7.5 0Z"
                fill={color}
            />
        </svg>
    );
});

PlusFull.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

PlusFull.displayName = 'PlusFull';

export default PlusFull;
