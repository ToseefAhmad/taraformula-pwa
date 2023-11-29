import { array, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import IngredientLink from '@app/components/Ingredients/IngredientLink';
import Image from '@magento/venia-ui/lib/components/Image';

import classes from './ingredientTile.module.css';

const IMAGE_WIDTH = 438;
const IMAGE_HEIGHT = 308;

const IngredientTile = ({ name, known, source, contains, image, products, url }) => {
    const productList =
        products &&
        products.length > 0 &&
        products.map(product => (
            // Add / to url_key Check MB-21730
            <Link key={product.name} to={'/' + product.url_key}>
                <p className={classes.productItem}>
                    {product.influence_type_label && (
                        <span className={classes.influenceType}>{product.influence_type_label}</span>
                    )}
                    <span>{product.name}</span>
                </p>
            </Link>
        ));

    return (
        <div className={classes.ingredientTile}>
            <IngredientLink url={url}>
                <Image
                    classes={{
                        image: classes.ingredientImage,
                        root: classes.ingredientImageWrapper
                    }}
                    alt={name}
                    src={image}
                    width={IMAGE_WIDTH}
                    height={IMAGE_HEIGHT}
                />
                <h4>{name}</h4>
            </IngredientLink>
            <div className={classes.ingredientSource}>
                <p className={classes.itemDescription}>
                    <FormattedMessage id="ingredientSearch.source" defaultMessage="Where we source ours:" />
                </p>
                <p>{source}</p>
            </div>
            <div className={classes.ingredientData}>
                <div className={classes.ingredientDataItem}>
                    <p className={classes.itemDescriptionMb}>
                        <FormattedMessage id="ingredientSearch.contains" defaultMessage="Contains:" />
                    </p>
                    <p className={classes.itemValue}>{contains} </p>
                </div>
                <div className={classes.ingredientDataItem}>
                    <p className={classes.itemDescriptionMb}>
                        <FormattedMessage id="ingredientSearch.knowTo" defaultMessage="Known to:" />
                    </p>
                    <p className={classes.itemValue}>{known}</p>
                </div>
            </div>
            {products && products.length > 0 && (
                <div className={classes.productList}>
                    <p className={classes.itemDescription}>
                        <FormattedMessage id="ingredientSearch.found" defaultMessage="Can be found in:" />
                    </p>
                    {productList}
                </div>
            )}
        </div>
    );
};

IngredientTile.propTypes = {
    name: string,
    category: string,
    known: string,
    source: string,
    contains: string,
    image: string,
    products: array,
    url: string
};
export default IngredientTile;
