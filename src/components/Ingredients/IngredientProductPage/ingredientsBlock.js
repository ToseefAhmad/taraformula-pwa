import { func, object, string } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import SlickSlider from 'react-slick';

import { ArrowLeft, ArrowRight } from '@app/components/Icons';
import Item from '@app/components/Ingredients/IngredientProductPage/ingredientItem';
import classes from '@app/components/Ingredients/IngredientProductPage/ingredientProductPage.module.css';
import IngredientsPopUp from '@app/components/Ingredients/IngredientProductPage/ingredientsPopUp';
import { Directions, getDirection } from '@app/hooks/useDirection';
import { useCarousel } from '@app/talons/useCarousel';

import { useIngredients } from './useIngredients';
import { usePopUp } from './usePopUp';

/**
 * Custom slider prev arrow component
 */
const PrevArrow = ({ className, style, onClick }) => {
    return <ArrowLeft className={className} style={style} onClick={onClick} size={33} />;
};

/**
 * Custom slider next arrow component
 *
 */
const NextArrow = ({ className, style, onClick }) => {
    return <ArrowRight className={className} style={style} onClick={onClick} size={33} textSize={22} />;
};

const IngredientsBlock = ({ ingredients, ingredientContent }) => {
    const { popUpOpen, handleOpenPopUp, handleClosePopUp } = usePopUp();
    const { handleBeforeChange, handleAfterChange, handleOnItemClick } = useCarousel();
    const { data, loading, error } = useIngredients(ingredients);

    if (!ingredients || error) {
        return null;
    }

    const isRtlDirection = getDirection() === Directions.rtl;

    if (data.length === 0) {
        return null;
    }

    const posts = data.map(item => (
        <Item key={item.entity_id} item={item} isLoading={loading} onClickCapture={handleOnItemClick} />
    ));
    const slidesToShow = 4;
    const currentSlides = data.length > slidesToShow ? slidesToShow : data.length;

    const ingredientButton = ingredientContent && (
        <div className={classes.link}>
            <div onClick={handleOpenPopUp} role="link" tabIndex={0} onKeyDown={handleOpenPopUp}>
                <FormattedMessage id={'productFullDetail.ingredientsLink'} defaultMessage={'See full list'} />
            </div>
        </div>
    );

    const settings = {
        arrows: true,
        rtl: isRtlDirection,
        slidesToScroll: 1,
        slidesToShow: currentSlides,
        variableWidth: false,
        dots: true,
        draggable: false,
        infinite: data.length > currentSlides,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    draggable: true,
                    slidesToShow: 1,
                    arrows: false,
                    centerMode: false,
                    infinite: data.length > 1
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    arrows: false,
                    centerMode: false,
                    draggable: true,
                    infinite: data.length > 2
                }
            }
        ],
        beforeChange: () => handleBeforeChange(),
        afterChange: () => handleAfterChange()
    };

    return (
        <Fragment>
            <div className={classes.ingredients}>
                <div className={classes.topContent}>
                    <h2 className={classes.blockHeader}>
                        <FormattedMessage
                            id={'productFullDetail.ingredientsSourced'}
                            defaultMessage={'Ingredients sourced from around the world'}
                        />
                    </h2>
                    {ingredientButton}
                </div>
                <div className={classes.list}>
                    <SlickSlider {...settings}>{posts}</SlickSlider>
                </div>
            </div>
            <IngredientsPopUp data={ingredientContent} isPopOpen={popUpOpen} handleClose={handleClosePopUp} />
        </Fragment>
    );
};

IngredientsBlock.propTypes = {
    ingredients: string,
    ingredientContent: string
};

export default IngredientsBlock;

/**
 * Props for {@link PrevArrow}
 *
 * @typedef props
 *
 * @property {string} className class name of the button
 * @property {Object} style is an object of inline styles
 * @property {Function} onClick show next slider item
 */
PrevArrow.propTypes = {
    className: string,
    style: object,
    onClick: func
};

/**
 * Props for {@link NextArrow}
 *
 * @typedef props
 *
 * @property {string} className class name of the button
 * @property {Object} style is an object of inline styles
 * @property {Function} onClick show previous slider item
 */
NextArrow.propTypes = {
    className: string,
    style: object,
    onClick: func
};
