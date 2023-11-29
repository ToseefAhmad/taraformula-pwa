import { func } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import classes from '@app/components/Ingredients/DiscoverIngredients/arrow.module.css';
import { getDirection, Directions } from '@app/hooks/useDirection';

const PrevArrow = ({ onClick }) => {
    return (
        <button className={classes.prev} onClick={onClick}>
            &lt;&lt; <FormattedMessage id={'discoverMore.previous'} defaultMessage={'Previous'} />
        </button>
    );
};

const NextArrow = ({ onClick }) => {
    return (
        <button className={classes.next} onClick={onClick}>
            <FormattedMessage id={'discoverMore.next'} defaultMessage={'Next'} /> &gt;&gt;
        </button>
    );
};

const direction = getDirection() === Directions.rtl;

export const carouselSettings = {
    slidesToShow: 2,
    slidesToScroll: 1,
    draggable: true,
    autoplay: false,
    infinite: true,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    dots: false,
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

PrevArrow.propTypes = {
    onClick: func
};

NextArrow.propTypes = {
    onClick: func
};
