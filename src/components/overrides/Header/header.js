import { shape, string } from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import CartPopUp from '@app/components/CartPopUp';
import OverlayWithHeader from '@app/components/OverlayWithHeader';
import OverlayWithoutHeader from '@app/components/OverlayWithoutHeader';
import HeaderSpace from '@app/components/overrides/Header/headerSpace';
import MegaMenu from '@app/components/overrides/MegaMenu';
import Navigation from '@app/components/overrides/Navigation';
import SearchBar from '@app/components/SearchBar';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import AuthModal from '@magento/venia-ui/lib/components/AuthModal';
import Logo from '@magento/venia-ui/lib/components/Logo';
import PageLoadingIndicator from '@magento/venia-ui/lib/components/PageLoadingIndicator';

import AccountTrigger from './accountTrigger';
import CartTrigger from './cartTrigger';
import defaultClasses from './header.module.css';
import LanguageSwitcher from './languageSwitcher';
import NavTrigger from './navTrigger';
import SearchTrigger from './searchTrigger';
import StoreSwitcher from './storeSwitcher';
import TopBar from './topBar';
import { useHeader } from './useHeader';

const Header = props => {
    const {
        handleSearchTriggerClick: toggleSearch,
        isSearchOpen,
        searchRef,
        searchTriggerRef,
        toggleSelectingCountry,
        selectingCountry,
        closeAllNavigation
    } = useHeader();

    const headerRef = useRef(null);
    const [cmsBlockLoaded, setCmsBlockLoaded] = useState(false);

    const [
        { cartItem },
        {
            actions: { setHeaderRef }
        }
    ] = useAppContext();

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isSearchOpen ? classes.open : classes.closed;

    const cartPopUp = cartItem && <CartPopUp headerRef={headerRef} data={cartItem} />;

    // Set reference to the header to be able to use it globally
    useEffect(() => {
        setHeaderRef(headerRef);
    }, [headerRef, setHeaderRef]);

    return (
        <>
            <header className={rootClass}>
                <div ref={headerRef}>
                    <TopBar setCmsBlockLoaded={setCmsBlockLoaded} />
                    <div className={classes.toolbar}>
                        <div className={classes.primaryActions}>
                            <NavTrigger selectingCountry={selectingCountry} />
                        </div>
                        <Link to={resourceUrl('/')} className={classes.logoContainer}>
                            <Logo />
                        </Link>
                        <MegaMenu />
                        <div className={classes.secondaryActions}>
                            <SearchTrigger active={isSearchOpen} onClick={toggleSearch} ref={searchTriggerRef} />
                            <AccountTrigger />
                            <div className={classes.storeSwitcherContainer}>
                                <StoreSwitcher />
                            </div>
                            <div className={classes.languageSwitcherContainer}>
                                <LanguageSwitcher />
                            </div>
                            <CartTrigger />
                            {cartPopUp}
                        </div>
                    </div>
                    <PageLoadingIndicator absolute />
                </div>
                <SearchBar
                    searchRef={searchRef}
                    offsetTop={headerRef.current ? headerRef.current.offsetHeight : 0}
                    isOpen={isSearchOpen}
                    toggleSearch={toggleSearch}
                />
            </header>
            <Navigation
                headerRef={headerRef}
                toggleSelectingCountry={toggleSelectingCountry}
                selectingCountry={selectingCountry}
                closeAllNavigation={closeAllNavigation}
            />
            <OverlayWithoutHeader />
            <OverlayWithHeader />
            <AuthModal />
            <HeaderSpace headerRef={headerRef} cmsBlockLoaded={cmsBlockLoaded} />
        </>
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
