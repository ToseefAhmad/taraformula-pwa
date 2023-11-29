import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Bag = forwardRef(({ color = 'currentColor', ...rest }, ref) => {
    return (
        <svg ref={ref} width="33" height="33" viewBox="0 0 33 33" {...rest}>
            <g id="a" clipPath="url(#b)">
                <g transform="translate(7 7)">
                    <path
                        d="M893.835,313.981h5.353a1.068,1.068,0,0,1,1.021.683l1,11.011a1,1,0,0,1-1.021,1.289H887.482a1,1,0,0,1-1.021-1.289l1-11.011a1.068,1.068,0,0,1,1.021-.683Z"
                        transform="translate(-886.408 -308.369)"
                        fill="none"
                        stroke={color}
                        strokeMiterlimit="10"
                        strokeWidth="1"
                    />
                    <path
                        d="M918.114,298.37v-3.18a3.462,3.462,0,0,1,6.924,0v3.18"
                        transform="translate(-914.148 -289.846)"
                        fill="none"
                        stroke={color}
                        strokeMiterlimit="10"
                        strokeWidth="1"
                    />
                </g>
            </g>
        </svg>
    );
});

Bag.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Bag.displayName = 'Bag';

export default Bag;
