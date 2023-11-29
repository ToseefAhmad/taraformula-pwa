import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Facebook = forwardRef(({ size = 33, color = 'currentColor', ...rest }, ref) => {
    return (
        <svg ref={ref} width={size} height={size} viewBox="0 0 33 33" {...rest}>
            <defs>
                <clipPath id="b">
                    <rect width="33" height="33" />
                </clipPath>
            </defs>
            <g id="a" clipPath="url(#b)">
                <rect width="33" height="33" fill="transparent" />
                <g transform="translate(5 5)">
                    <rect width="24" height="24" fill="#023527" opacity="0" />
                    <path
                        d="M9,0H6.545A4.046,4.046,0,0,0,2.455,4V6.4H0V9.6H2.455V16H5.727V9.6H8.182L9,6.4H5.727V4a.809.809,0,0,1,.818-.8H9Z"
                        transform="translate(7.066 4)"
                        fill={color}
                    />
                </g>
            </g>
        </svg>
    );
});

Facebook.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Facebook.displayName = 'Facebook';

export default Facebook;
