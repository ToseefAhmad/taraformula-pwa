import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Check = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="33" height="33" viewBox="0 0 33 33" {...rest}>
            <defs>
                <clipPath id="b">
                    <rect width="33" height="33" />
                </clipPath>
            </defs>
            <g id="a" clipPath="url(#b)">
                <rect width="33" height="33" fill="transparent" />
                <g transform="translate(11 13)">
                    <path
                        d="M-6269.394-11116.947l2.85,2.851,7.194-7.193"
                        transform="translate(6269.394 11121.29)"
                        fill="none"
                        stroke="#023527"
                        strokeWidth="1"
                    />
                </g>
            </g>
        </svg>
    );
});

Check.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Check.displayName = 'Check';

export default Check;
