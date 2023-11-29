import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

import { Directions, getDirection } from '@app/hooks/useDirection';

const Delivery = forwardRef(({ ...rest }, ref) => {
    const rtlDirection = getDirection() === Directions.rtl;
    const svg = rtlDirection ? (
        <g id="Group_1432" data-name="Group 1432">
            <g id="Group_1077" data-name="Group 1077">
                <path
                    id="Path_199"
                    data-name="Path 199"
                    d="M7.232,23.26H.442a.442.442,0,0,0,0,.885h6.79a.442.442,0,0,0,0-.885"
                    transform="translate(15.539 -20.334)"
                    fill="#023527"
                />
                <path
                    id="Path_200"
                    data-name="Path 200"
                    d="M36.44,37.462H30.951a.442.442,0,0,0,0,.885H36.44a.442.442,0,1,0,0-.885"
                    transform="translate(-17.507 -32.75)"
                    fill="#023527"
                />
                <path
                    id="Path_201"
                    data-name="Path 201"
                    d="M30.974,51.658H19.758a.442.442,0,0,0,0,.885H30.974a.442.442,0,0,0,0-.885"
                    transform="translate(-10.633 -45.16)"
                    fill="#023527"
                />
                <path
                    id="Path_202"
                    data-name="Path 202"
                    d="M9.381,3.877,13.875.6a1.717,1.717,0,0,1,1.3-.6H26.906V1.48a.442.442,0,1,1-.885,0v-.6H15.584a1.717,1.717,0,0,0-1.3.6L10.265,4.2V10.49h.88a1.992,1.992,0,0,1,3.875,0H21.3a1.992,1.992,0,0,1,3.875,0h.849V9.062H25.7a.442.442,0,0,1,0-.885h5.271a.442.442,0,0,1,0,.885H26.9v2.313H25.184a1.994,1.994,0,0,1-3.9,0H15.031a1.994,1.994,0,0,1-3.9,0H9.38v-7.5Zm13.854,8.331a1.251,1.251,0,1,0-1.251-1.251,1.251,1.251,0,0,0,1.251,1.251m-10.153,0a1.251,1.251,0,1,0-1.252-1.251,1.251,1.251,0,0,0,1.252,1.251"
                    transform="translate(-9.38 0)"
                    fill="#023527"
                />
            </g>
        </g>
    ) : (
        <g id="Group_1432" data-name="Group 1432" transform="translate(-2)">
            <g id="Group_1077" data-name="Group 1077" transform="translate(2)">
                <path
                    id="Path_199"
                    data-name="Path 199"
                    d="M.442,23.26h6.79a.442.442,0,1,1,0,.885H.442a.442.442,0,0,1,0-.885"
                    transform="translate(0 -20.334)"
                    fill="#023527"
                />
                <path
                    id="Path_200"
                    data-name="Path 200"
                    d="M30.951,37.462H36.44a.442.442,0,1,1,0,.885H30.951a.442.442,0,1,1,0-.885"
                    transform="translate(-26.671 -32.75)"
                    fill="#023527"
                />
                <path
                    id="Path_201"
                    data-name="Path 201"
                    d="M19.758,51.658H30.974a.442.442,0,1,1,0,.885H19.758a.442.442,0,1,1,0-.885"
                    transform="translate(-16.886 -45.16)"
                    fill="#023527"
                />
                <path
                    id="Path_202"
                    data-name="Path 202"
                    d="M31.413,3.877,26.918.6a1.717,1.717,0,0,0-1.3-.6H13.888V1.48a.442.442,0,1,0,.885,0v-.6H25.21a1.717,1.717,0,0,1,1.3.6L30.528,4.2v6.285h-.88a1.992,1.992,0,0,0-3.875,0H19.5a1.992,1.992,0,0,0-3.875,0h-.849V9.062h.321a.442.442,0,1,0,0-.885H9.822a.442.442,0,0,0,0,.885h4.066v2.313h1.721a1.994,1.994,0,0,0,3.9,0h6.253a1.994,1.994,0,0,0,3.9,0h1.752v-7.5ZM17.559,12.208a1.251,1.251,0,1,1,1.251-1.251,1.251,1.251,0,0,1-1.251,1.251m10.153,0a1.251,1.251,0,1,1,1.252-1.251,1.251,1.251,0,0,1-1.252,1.251"
                    transform="translate(-8.2 0)"
                    fill="#023527"
                />
            </g>
        </g>
    );

    return (
        <svg ref={ref} width="23.21" height="13" viewBox="0 0 23.21 13" {...rest}>
            <defs>
                <clipPath id="b">
                    <rect width="23.21" height="13" />
                </clipPath>
            </defs>
            <g id="a" clipPath="url(#b)">
                <rect width="23.21" height="13" fill="transparent" />
                {svg}
            </g>
        </svg>
    );
});

Delivery.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Delivery.displayName = 'Delivery';

export default Delivery;
