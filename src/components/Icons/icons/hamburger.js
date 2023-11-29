import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Hamburger = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="33" height="33" viewBox="0 0 33 33" {...rest}>
            <defs>
                <clipPath id="b">
                    <rect width="33" height="33" />
                </clipPath>
            </defs>
            <g id="a" clipPath="url(#b)">
                <rect width="33" height="33" fill="transparent" />
                <g transform="translate(9 11)">
                    <line x1="16" fill="none" stroke="#023527" strokeWidth="1" />
                    <line x1="16" transform="translate(0 6.249)" fill="none" stroke="#023527" strokeWidth="1" />
                    <line x1="16" transform="translate(0 12.498)" fill="none" stroke="#023527" strokeWidth="1" />
                </g>
            </g>
        </svg>
    );
});

Hamburger.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Hamburger.displayName = 'Hamburger';

export default Hamburger;
