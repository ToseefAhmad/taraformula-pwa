import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Close = forwardRef(({ color = 'currentColor', size = 33, ...rest }, ref) => {
    return (
        <svg ref={ref} width={size} height={size} viewBox="0 0 33 33" {...rest}>
            <defs>
                <clipPath id="b">
                    <rect width="33" height="33" />
                </clipPath>
            </defs>
            <g id="a" clipPath="url(#b)">
                <rect width="33" height="33" fill="transparent" />
                <g transform="translate(3 4)">
                    <g transform="translate(13.435) rotate(45)" stroke={color}>
                        <line x2="19" transform="translate(0 9.5)" fill="none" strokeWidth="1" />
                        <line y2="19" transform="translate(9.5)" fill="none" strokeWidth="1" />
                    </g>
                </g>
            </g>
        </svg>
    );
});

Close.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Close.displayName = 'Close';

export default Close;
