import classnames from 'classnames';
import { chunk } from 'lodash';
import { func, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './ingredientSearch.module.css';
import IngredientTile from './ingredientTile';
import IngredientTileShimmer from './ingredientTile.shimmer';
import { useIngredientSearch } from './useIngredientSearch';

const IngredientSearch = ({ executeScroll, letter }) => {
    const {
        handleLetter,
        handleCategory,
        productIngredients,
        productIngredientsAlphabet,
        productIngredientCategories,
        queryItems
    } = useIngredientSearch({ letter });
    const alphabet =
        !productIngredientsAlphabet || !productIngredientsAlphabet.items || !productIngredientsAlphabet.items.length ? (
            <div className={classes.shimmerAlpha}>
                <Shimmer height={'100%'} width={'100%'} />
            </div>
        ) : (
            <div className={classes.letterListContainer}>
                {productIngredientsAlphabet.items.map(item => (
                    <button
                        className={classnames(classes.letterButton, {
                            [classes.selected]: queryItems.letter === item.letter
                        })}
                        key={item.letter}
                        disabled={item.count < 1}
                        onClick={() => {
                            handleLetter(item.letter);
                        }}
                        title={item.letter.toUpperCase()}
                    >
                        {item.letter}
                    </button>
                ))}
            </div>
        );

    const categories =
        !productIngredientCategories ||
        !productIngredientCategories.items ||
        !productIngredientCategories.items.length ? (
            <div className={classes.shimmerCategory}>
                <Shimmer width={'100%'} height={'100%'} />
            </div>
        ) : (
            <div className={classes.listContainer}>
                <button
                    className={classnames(classes.categoryButton, {
                        [classes.selected]: queryItems.category === null
                    })}
                    onClick={() => {
                        handleCategory(null);
                    }}
                >
                    <FormattedMessage id="ingredientSearch.all" defaultMessage="ALL" />
                </button>

                {productIngredientCategories.items.map(item => (
                    <button
                        className={classnames(classes.categoryButton, {
                            [classes.selected]: queryItems.category === item.name
                        })}
                        key={item.name}
                        onClick={() => {
                            handleCategory(item.name);
                        }}
                    >
                        {item.name}
                    </button>
                ))}

                <button className={classes.categoryButton} onClick={executeScroll}>
                    <FormattedMessage id="ingredientSearch.ourNeverList" defaultMessage="OUR NEVER LIST" />
                </button>
            </div>
        );

    // This is necessary for rendering each row with 3 ingredient blocks
    const ingredientTripleArray =
        productIngredients &&
        productIngredients.items &&
        productIngredients.items.length > 0 &&
        chunk(productIngredients.items, 3);

    const ingredientList =
        ingredientTripleArray && ingredientTripleArray.length ? (
            ingredientTripleArray.map((ingredientTriple, index) => (
                <div key={index} className={classes.ingredientList}>
                    {ingredientTriple.map(prodIngredient => (
                        <IngredientTile
                            key={prodIngredient.ingredient.url_key + index}
                            name={prodIngredient.ingredient.name}
                            known={prodIngredient.ingredient.known}
                            source={prodIngredient.ingredient.source}
                            contains={prodIngredient.ingredient.contains}
                            image={prodIngredient.ingredient.image}
                            products={prodIngredient.products}
                            url={prodIngredient.ingredient.url_key}
                        />
                    ))}
                </div>
            ))
        ) : (
            <div className={classes.ingredientList}>
                <IngredientTileShimmer />
                <IngredientTileShimmer />
                <IngredientTileShimmer />
            </div>
        );

    return (
        <div>
            <div className={classes.filters}>
                <section className={classes.categorySection}>
                    <p className={classes.textArea}>
                        <FormattedMessage id="ingredientSearch.explore" defaultMessage="Explore:" />
                    </p>
                    <div className={classes.optionContainer}>
                        {categories}
                        {alphabet}
                    </div>
                </section>
            </div>
            <section className={classes.listSection}>{ingredientList}</section>
        </div>
    );
};

IngredientSearch.defaultProps = {
    letter: ''
};

IngredientSearch.propTypes = {
    executeScroll: func,
    letter: string
};

export default IngredientSearch;
