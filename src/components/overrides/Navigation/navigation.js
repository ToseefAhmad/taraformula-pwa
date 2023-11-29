import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import AuthBar from '@magento/venia-ui/lib/components/AuthBar';
import CategoryTree from '@magento/venia-ui/lib/components/CategoryTree';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import LanguageSwitcher from './languageSwitcher';
import classes from './navigation.module.css';
import StoreSwitcher from './storeSwitcher';
import { useNavigation } from './useNavigation';

const AuthModal = React.lazy(() => import('@magento/venia-ui/lib/components/AuthModal'));

const Navigation = ({ headerRef, toggleSelectingCountry, selectingCountry, closeAllNavigation }) => {
    const {
        catalogActions,
        categoryId,
        handleClose,
        hasModal,
        isOpen,
        setCategoryId,
        showCreateAccount,
        showForgotPassword,
        showMainMenu,
        showMyAccount,
        showSignIn,
        view
    } = useNavigation(closeAllNavigation);

    const rootClassName = isOpen ? classes.root_open : classes.root;
    const modalClassName = hasModal ? classes.modal_open : classes.modal;
    const bodyClassName = hasModal ? classes.body_masked : classes.body;
    const rootStyle = {
        marginTop: headerRef.current ? headerRef.current.offsetHeight : 0
    };

    // Lazy load the auth modal because it may not be needed.
    const authModal = hasModal ? (
        <Suspense fallback={<LoadingIndicator />}>
            <AuthModal
                closeDrawer={handleClose}
                showCreateAccount={showCreateAccount}
                showForgotPassword={showForgotPassword}
                showMainMenu={showMainMenu}
                showMyAccount={showMyAccount}
                showSignIn={showSignIn}
                view={view}
            />
        </Suspense>
    ) : null;

    return (
        <aside className={rootClassName} style={rootStyle}>
            <div className={bodyClassName}>
                <CategoryTree
                    categoryId={categoryId}
                    onNavigate={handleClose}
                    setCategoryId={setCategoryId}
                    updateCategories={catalogActions.updateCategories}
                />
                <div className={classes.customLinkContainer}>
                    <Link className={classes.customLink} to="/ingredients" onClick={handleClose}>
                        <FormattedMessage id={'global.ingredients'} defaultMessage={'Ingredients'} />
                    </Link>
                </div>
                <div className={classes.customLinkContainer}>
                    <Link className={classes.customLink} to="/philosophy" onClick={handleClose}>
                        <FormattedMessage id={'global.philosophy'} defaultMessage={'Philosophy'} />
                    </Link>
                </div>
                <div className={classes.customLinkContainer}>
                    <Link className={classes.customLink} to={`/blog`} onClick={handleClose}>
                        <FormattedMessage id={'global.journal'} defaultMessage={'Journal'} />
                    </Link>
                </div>
                <div>
                    <AuthBar disabled={hasModal} showMyAccount={showMyAccount} showSignIn={showSignIn} />
                    <StoreSwitcher
                        toggleSelectingCountry={toggleSelectingCountry}
                        selectingCountry={selectingCountry}
                        closeAllNavigation={closeAllNavigation}
                    />
                    <LanguageSwitcher />
                </div>
            </div>
            <div className={modalClassName}>{authModal}</div>
        </aside>
    );
};

export default Navigation;

Navigation.propTypes = {
    headerRef: PropTypes.any,
    toggleSelectingCountry: PropTypes.func,
    selectingCountry: PropTypes.bool,
    closeAllNavigation: PropTypes.func
};
