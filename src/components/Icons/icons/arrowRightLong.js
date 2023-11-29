import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const ArrowRightLong = forwardRef(({ size = 25, color = 'currentColor', ...rest }, ref) => {
    return (
        <svg ref={ref} width={size} height={size} stroke={color} viewBox="0 0 24.999999 25" {...rest}>
            <g id="arrowRightLong" data-name="arrowRightLong" transform="translate(1.1708958,5.4034647)">
                <line
                    id="Line_4"
                    data-name="Line 4"
                    x2="22"
                    transform="translate(0,6.998)"
                    fill="none"
                    x1="0"
                    y1="0"
                    y2="0"
                />
                <path
                    id="Path_128"
                    data-name="Path 128"
                    d="m -21796.148,3635.959 4.791,6.972 -4.791,7.228"
                    transform="translate(21813.412,-3635.959)"
                    fill="none"
                />
            </g>
        </svg>
    );
});

ArrowRightLong.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

ArrowRightLong.displayName = 'ArrowRightLong';

export default ArrowRightLong;
