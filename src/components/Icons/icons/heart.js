import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Heart = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="33" height="33" viewBox="0 0 33 33" {...rest}>
            <defs>
                <clipPath id="b">
                    <rect width="33" height="33" />
                </clipPath>
            </defs>
            <g id="a" clipPath="url(#b)">
                <rect width="33" height="33" fill="transparent" />
                <g transform="translate(8 10)">
                    <path
                        d="M8.49,14h0l-.208-.111a28.846,28.846,0,0,1-4.268-2.9A15.549,15.549,0,0,1,1.247,8.11,5.87,5.87,0,0,1,0,4.765,4.856,4.856,0,0,1,4.931,0,4.954,4.954,0,0,1,8.5,1.477,4.957,4.957,0,0,1,12.069,0,4.856,4.856,0,0,1,17,4.765a6.172,6.172,0,0,1-1.249,3.513,14.268,14.268,0,0,1-2.773,2.865A25.383,25.383,0,0,1,8.7,13.9l-.213.1ZM4.931.865A3.974,3.974,0,0,0,.9,4.765c0,3.717,6.343,7.524,7.614,8.25,1.268-.666,7.6-4.2,7.6-8.25A3.974,3.974,0,0,0,12.07.865a4.056,4.056,0,0,0-3.213,1.54L8.5,2.857l-.355-.452A4.059,4.059,0,0,0,4.931.865Z"
                        fill="#023527"
                    />
                </g>
            </g>
        </svg>
    );
});

Heart.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Heart.displayName = 'Heart';

export default Heart;
