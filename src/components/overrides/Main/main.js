import { array, bool, shape, string, object, oneOfType } from 'prop-types';
import React from 'react';

import FacebookTag from '@app/components/FacebookTag';
import Footer from '@app/components/overrides/Footer';
import Header from '@app/components/overrides/Header';
import ShareASale from '@app/components/ShareASale/shareASale';
import { useScrollLock } from '@magento/peregrine';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './main.module.css';

const Main = props => {
    const { children, isMasked } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isMasked ? classes.root_masked : classes.root;
    const pageClass = isMasked ? classes.page_masked : classes.page;

    useScrollLock(isMasked);

    const urlLocation = window.location.hostname;

    // Adding FacebookTag to return
    return (
        <main className={rootClass}>
            <FacebookTag location={urlLocation} />
            <Header />
            <div className={pageClass}>{children}</div>
            <Footer />
            <ShareASale />
        </main>
    );
};

export default Main;

Main.propTypes = {
    classes: shape({
        page: string,
        page_masked: string,
        root: string,
        root_masked: string
    }),
    children: oneOfType([array, object]),
    isMasked: bool
};
