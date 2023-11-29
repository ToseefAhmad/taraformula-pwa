import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Cross = forwardRef(({ color = 'currentColor', size = 10, ...rest }, ref) => {
    return (
        <svg ref={ref} width={size} height={size} viewBox="0 0 10 10" stroke={color} {...rest}>
            <g transform="rotate(45, 5, 5)">
                <line x1="-5" y1="5" x2="15" y2="5" />
                <line x1="5" y1="-5" x2="5" y2="15" />
            </g>
        </svg>
    );
});

Cross.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Cross.displayName = 'Cross';

export default Cross;
