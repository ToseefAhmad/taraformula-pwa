import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Minus = forwardRef(({ color = 'currentColor', ...rest }, ref) => {
    return (
        <svg ref={ref} width="33" height="33" viewBox="0 0 33 33" {...rest}>
            <g id="a" clipPath="url(#b)">
                <g transform="translate(11 17)">
                    <line x2="12" fill="none" stroke={color} strokeWidth="1" />
                </g>
            </g>
        </svg>
    );
});

Minus.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Minus.displayName = 'Minus';

export default Minus;
