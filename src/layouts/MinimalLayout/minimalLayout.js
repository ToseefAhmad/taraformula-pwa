import { node, oneOf } from 'prop-types';
import React from 'react';

import Footer from '@app/components/MinimalLayout/Footer';
import Header from '@app/components/MinimalLayout/Header';
import useCartRestore from '@app/hooks/useCartRestore';
import useDirection, { Directions } from '@app/hooks/useDirection';
import useLanguage from '@app/hooks/useLanguage';
import useUrlCleaner from '@app/hooks/useUrlCleaner';

import classes from './minimalLayout.module.css';

const MinimalLayout = ({ direction, children }) => {
    useDirection(direction);
    useLanguage();
    useCartRestore();
    useUrlCleaner();

    return (
        <>
            <Header />
            <main className={classes.main}>{children}</main>
            <Footer />
        </>
    );
};

MinimalLayout.propTypes = {
    direction: oneOf(Object.values(Directions)),
    children: node
};

export default MinimalLayout;
