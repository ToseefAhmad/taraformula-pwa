import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const ArrowRight = forwardRef(({ size = 22, textSize, ...rest }, ref) => {
    const viewBox = `0 0 ${size} ${size}`;

    return (
        <svg ref={ref} width={size} height={size} viewBox={viewBox} {...rest}>
            <g id="a" clipPath="url(#b)">
                <g transform="translate(0 1)">
                    <ellipse cx="16.5" cy="16" rx="16.5" ry="16" fill="transparent" />
                    <text transform="translate(14 23)" fill="#023527" fontSize={textSize || size} fontFamily="Arsenal">
                        <tspan x="0" y="0">
                            &gt;
                        </tspan>
                    </text>
                </g>
            </g>
        </svg>
    );
});

ArrowRight.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    textSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

ArrowRight.displayName = 'ArrowRight';

export default ArrowRight;
