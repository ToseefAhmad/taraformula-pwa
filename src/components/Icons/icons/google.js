import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Google = forwardRef(({ size = 33, color = 'currentColor', ...rest }, ref) => {
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
                        d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"
                        fill={color}
                    />
                </g>
            </g>
        </svg>
    );
});

Google.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Google.displayName = 'Google';

export default Google;
