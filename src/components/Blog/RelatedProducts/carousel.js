import React from 'react';

import { getDirection, Directions } from '@app/hooks/useDirection';

const direction = getDirection() === Directions.rtl;

export const carouselSettings = {
    slidesToShow: 2,
    slidesToScroll: 1,
    draggable: true,
    autoplay: false,
    infinite: true,
    arrows: false,
    dots: true,
    variableWidth: false,
    rtl: direction,
    dotsClass: 'slick-line',
    // eslint-disable-next-line react/display-name
    appendDots: dots => {
        return <ul style={{ display: 'flex' }}>{dots}</ul>;
    },
    responsive: [
        {
            breakpoint: 1280,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 640,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                variableWidth: true
            }
        }
    ]
};
