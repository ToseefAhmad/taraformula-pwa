import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const ArrowDown = forwardRef(({ size = 22, ...rest }, ref) => {
    const viewBox = `0 0 ${size} ${size}`;

    return (
        <svg ref={ref} width={size} height={size} viewBox={viewBox} {...rest}>
            <g id="a" clipPath="url(#b)">
                <g transform="translate(3 13)">
                    <g transform="translate(1209 -1382) rotate(90)">
                        <text transform="translate(1382 1203)" fill="#023527" fontSize={size} fontFamily="Arsenal">
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

ArrowDown.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

ArrowDown.displayName = 'ArrowDown';

export default ArrowDown;
