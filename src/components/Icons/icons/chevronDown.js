import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const ChevronDown = forwardRef(({ color = 'currentColor', size = 10, ...rest }, ref) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            ref={ref}
            width={size}
            height={size}
            viewBox="0 0 15.645 9.901"
            stroke={color}
            {...rest}
        >
            <path
                id="Path_213"
                data-name="Path 213"
                d="M2090.956-1201.77l7.566,8.8,7.316-8.8"
                transform="translate(-2090.577 1202.096)"
                fill="none"
            />
        </svg>
    );
});

ChevronDown.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

ChevronDown.displayName = 'ChevronDown';

export default ChevronDown;
