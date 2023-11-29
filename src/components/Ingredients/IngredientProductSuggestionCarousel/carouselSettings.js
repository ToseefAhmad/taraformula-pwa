import React from 'react';

import { getDirection, Directions } from '@app/hooks/useDirection';

const dotsWrapper = dots => {
    return <ul>{dots}</ul>;
};

const direction = getDirection() === Directions.rtl;

export const carouselSettings = {
    slidesToShow: 2,
    slidesToScroll: 1,
    draggable: true,
    autoplay: false,
    infinite: true,
    arrows: false,
    dots: true,
    dotsClass: 'slick-line',
    appendDots: dotsWrapper,
    variableWidth: false,
    rtl: direction,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3
            }
        },
        {
            breakpoint: 640,
            settings: {
                slidesToShow: 2
            }
        }
    ]
};
