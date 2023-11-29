import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const ArrowUp = forwardRef(({ size = 33, ...rest }, ref) => {
    const viewBox = `0 0 ${size} ${size}`;

    return (
        <svg ref={ref} width={size} height={size} viewBox={viewBox} {...rest}>
            <g id="a" clipPath="url(#b)">
                <g transform="translate(3 13)">
                    <g transform="translate(-1181 1390) rotate(-90)">
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

ArrowUp.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

ArrowUp.displayName = 'ArrowUp';

export default ArrowUp;
