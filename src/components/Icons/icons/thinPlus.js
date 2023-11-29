import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const ThinPlus = forwardRef(({ color = 'currentColor', size = 32, ...rest }, ref) => {
    return (
        <svg ref={ref} width={size} height={size} viewBox="0 0 32 32" {...rest}>
            <path d="M17 0H15V15H0V17H15V32H17V17H32V15H17V0Z" fill={color} />
        </svg>
    );
});

ThinPlus.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

ThinPlus.displayName = 'ThinPlus';

export default ThinPlus;
