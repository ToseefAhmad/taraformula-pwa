import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Star = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="33" height="33" viewBox="0 0 33 33" {...rest}>
            <defs>
                <clipPath id="b">
                    <rect width="33" height="33" />
                </clipPath>
            </defs>
            <g id="a" clipPath="url(#b)">
                <rect width="33" height="33" fill="transparent" />
                <g transform="translate(9 9)">
                    <path
                        d="M8,12,3.3,14.472l.9-5.236L.392,5.528l5.257-.764L8,0l2.351,4.764,5.257.764L11.8,9.236l.9,5.236Z"
                        transform="translate(-0.392)"
                        fill="#023527"
                    />
                </g>
            </g>
        </svg>
    );
});

Star.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Star.displayName = 'Star';

export default Star;
