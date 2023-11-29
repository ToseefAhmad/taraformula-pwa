import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const VideoPlay = forwardRef(({ color = '#fff', size = 98, ...rest }, ref) => {
    return (
        <svg ref={ref} width={size} height={size} viewBox="0 0 98 98" {...rest}>
            <g id="Video_Play_Icon" data-name="Video Play Icon">
                <g
                    id="Ellipse_21"
                    data-name="Ellipse 21"
                    transform="translate(-0.188 -0.188)"
                    fill="none"
                    stroke={color}
                >
                    <circle cx="49" cy="49" r="49" stroke="none" />
                    <circle cx="49" cy="49" r="47.5" fill="none" />
                </g>
                <path
                    id="Polygon_1"
                    data-name="Polygon 1"
                    d="M19,0,38,31H0Z"
                    transform="translate(68.813 29.813) rotate(90)"
                    fill={color}
                />
            </g>
        </svg>
    );
});

VideoPlay.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

VideoPlay.displayName = 'VideoPlay';

export default VideoPlay;
