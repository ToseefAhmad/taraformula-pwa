import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const NewsletterArrow = forwardRef(({ ...rest }, ref) => {
    return (
        <svg ref={ref} width="33" height="33" viewBox="0 0 33 33" {...rest}>
            <defs>
                <clipPath id="b">
                    <rect width="33" height="33" />
                </clipPath>
            </defs>
            <g id="a" clipPath="url(#b)">
                <rect width="33" height="33" fill="transparent" />
                <g transform="translate(10 13)">
                    <line x2="12" transform="translate(0 4.041)" fill="none" stroke="#023527" strokeWidth="1" />
                    <path
                        d="M-21796.148,3635.959l4.791,4.026-4.791,4.174"
                        transform="translate(21803.412 -3635.959)"
                        fill="none"
                        stroke="#023527"
                        strokeWidth="1"
                    />
                </g>
            </g>
        </svg>
    );
});

NewsletterArrow.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

NewsletterArrow.displayName = 'NewsletterArrow';

export default NewsletterArrow;
