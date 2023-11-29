import { shape, string } from 'prop-types';
import React, { Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';

import BackToCart from '@app/components/MinimalLayout/Header/backToCart';
import OverlayWithoutHeader from '@app/components/OverlayWithoutHeader';
import AccountTrigger from '@app/components/overrides/Header/accountTrigger';
import TopBar from '@app/components/overrides/Header/topBar';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import AuthModal from '@magento/venia-ui/lib/components/AuthModal';
import Logo from '@magento/venia-ui/lib/components/Logo';
import PageLoadingIndicator from '@magento/venia-ui/lib/components/PageLoadingIndicator';

import defaultClasses from './header.module.css';

const Header = props => {
    const headerRef = useRef(null);
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Fragment>
            <header className={classes.root} ref={headerRef}>
                <TopBar />
                <div className={classes.toolbar}>
                    <BackToCart />
                    <Link to={resourceUrl('/')} className={classes.logoContainer}>
                        <Logo />
                    </Link>
                    <div className={classes.secondaryActions}>
                        <AccountTrigger />
                    </div>
                </div>
                <PageLoadingIndicator absolute />
            </header>
            <OverlayWithoutHeader />
            <AuthModal />
        </Fragment>
    );
};

Header.propTypes = {
    classes: shape({
        closed: string,
        logo: string,
        open: string,
        primaryActions: string,
        secondaryActions: string,
        toolbar: string,
        switchers: string,
        switchersContainer: string
    })
};

export default Header;
