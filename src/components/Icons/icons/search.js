import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Search = forwardRef(({ color = 'currentColor', strokeWidth = 'currentStroke', ...rest }, ref) => {
    return (
        <svg
            ref={ref}
            id="Search_Icon"
            data-name="Search Icon"
            width="16.854"
            height="18"
            viewBox="0 0 16.854 16.854"
            {...rest}
        >
            <g id="Ellipse_36" data-name="Ellipse 36" fill="none" stroke={color} strokeWidth={strokeWidth}>
                <circle cx="6.8" cy="6.5" r="6.5" stroke="none" />
                <circle cx="6.8" cy="6.5" r="6" fill="none" />
            </g>
            <line
                id="Line_193"
                data-name="Line 193"
                x2="6"
                y2="6"
                transform="translate(10.5 10.5)"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
});

Search.propTypes = {
    color: PropTypes.string,
    strokeWidth: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Search.displayName = 'Search';

export default Search;
