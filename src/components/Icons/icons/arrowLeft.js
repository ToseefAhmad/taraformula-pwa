import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const ArrowLeft = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="33" height="33" viewBox="0 0 33 33" {...rest}>
            <defs>
                <clipPath id="b">
                    <rect width="33" height="33" />
                </clipPath>
            </defs>
            <g id="a" clipPath="url(#b)">
                <rect width="33" height="33" fill="transparent" />
                <g transform="translate(0 1)">
                    <g transform="translate(1401 1212) rotate(180)">
                        <ellipse
                            cx="16.5"
                            cy="16"
                            rx="16.5"
                            ry="16"
                            transform="translate(1368 1180)"
                            fill="transparent"
                        />
                        <text
                            transform="translate(1382 1203)"
                            fill="#023527"
                            fontSize="22"
                            fontFamily="Arsenal-Regular, Arsenal"
                        >
                            <tspan x="0" y="0">
                                &gt;
                            </tspan>
                        </text>
                    </g>
                </g>
            </g>
        </svg>
    );
});

ArrowLeft.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

ArrowLeft.displayName = 'ArrowLeft';

export default ArrowLeft;
