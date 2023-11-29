import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Plus = forwardRef(({ color = 'currentColor', ...rest }, ref) => {
    return (
        <svg ref={ref} width="33" height="33" viewBox="0 0 33 33" {...rest}>
            <g id="a" clipPath="url(#b)">
                <g transform="translate(11 11)">
                    <line x2="12" transform="translate(0 6)" fill="none" stroke={color} strokeWidth="1" />
                    <line y2="12" transform="translate(6)" fill="none" stroke={color} strokeWidth="1" />
                </g>
            </g>
        </svg>
    );
});

Plus.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Plus.displayName = 'Plus';

export default Plus;
