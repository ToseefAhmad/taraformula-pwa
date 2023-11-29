import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import classes from './emptyCart.module.css';

const EmptyCart = () => {
    return (
        <div className={classes.root}>
            <h1 className={classes.header}>
                <FormattedMessage id={'cartPage.emptyCart'} defaultMessage={'There are no items in your cart.'} />
            </h1>
            <Link to={resourceUrl('/')} className={classes.button}>
                <FormattedMessage id={'cartPage.backToHome'} defaultMessage={'Back to home'} />
            </Link>
        </div>
    );
};

export default EmptyCart;
