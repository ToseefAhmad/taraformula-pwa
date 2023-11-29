import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Box = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="33" height="33" viewBox="0 0 33 33" {...rest}>
            <defs>
                <clipPath id="b">
                    <rect width="33" height="33" />
                </clipPath>
            </defs>
            <g id="a" clipPath="url(#b)">
                <rect width="33" height="33" fill="transparent" />
                <g transform="translate(6 5)">
                    <path
                        d="M22,23H0L0,6.123,4.811,0H17.191L22,6.123V23ZM1.231,6.943V21.73H20.769V6.943Zm10.4-5.674V5.711H20.1l-3.5-4.442Zm-6.226,0h0L1.9,5.711h8.464V1.269H5.407ZM9.88,17.4h0l-2.5-2.5.895-.9,1.6,1.607,3.879-3.884.894.9L9.881,17.4Z"
                        fill="#023527"
                    />
                </g>
            </g>
        </svg>
    );
});

Box.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Box.displayName = 'Box';

export default Box;
