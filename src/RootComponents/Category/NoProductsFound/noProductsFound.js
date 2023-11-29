import { number, string, shape } from 'prop-types';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { useNoProductsFound } from '@magento/peregrine/lib/talons/RootComponents/Category';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import classes from './noProductsFound.module.css';

const NoProductsFound = ({ categoryId }) => {
    const { recommendedCategories } = useNoProductsFound({
        categoryId
    });

    const categoryItems = useMemo(() => {
        return recommendedCategories.map(category => {
            const uri = resourceUrl(`/${category.url_path}${category.url_suffix}`);

            return (
                <li key={category.id} className={classes.listItem}>
                    <Link to={uri} className={classes.listItemLink}>
                        {category.name}
                    </Link>
                </li>
            );
        });
    }, [recommendedCategories]);

    return (
        <div className={classes.root}>
            <h1 className={classes.header}>
                <FormattedMessage
                    id={'noProductsFound.noProductsFound'}
                    defaultMessage={"Sorry! We couldn't find any products."}
                />
            </h1>
            <div className={classes.categories}>
                <p>
                    <FormattedMessage
                        id={'noProductsFound.tryOneOfTheseCategories'}
                        defaultMessage={'Try one of these categories'}
                    />
                </p>
                <ul className={classes.list}>{categoryItems}</ul>
            </div>
        </div>
    );
};

export default NoProductsFound;

NoProductsFound.propTypes = {
    categoryId: number,
    classes: shape({
        root: string,
        title: string,
        list: string,
        categories: string,
        listItem: string,
        image: string,
        imageContainer: string
    })
};
