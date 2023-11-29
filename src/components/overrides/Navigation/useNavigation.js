import { useCallback, useEffect, useMemo, useState } from 'react';

import { useStoreConfigContext } from '@app/context/StoreConfigContext/useStoreConfigContext';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCatalogContext } from '@magento/peregrine/lib/context/catalog';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import useInternalLink from '@magento/peregrine/lib/hooks/useInternalLink';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/Navigation/navigation.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const ancestors = {
    CREATE_ACCOUNT: 'SIGN_IN',
    FORGOT_PASSWORD: 'SIGN_IN',
    MY_ACCOUNT: 'MENU',
    SIGN_IN: 'MENU',
    MENU: null
};

export const useNavigation = (closeAllNavigation, props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCustomerQuery } = operations;
    // Retrieve app state from context
    const [
        { drawer, overlayWithoutHeader, showAuthModal },
        {
            closeDrawer,
            actions: { setOverlayWithoutHeader }
        }
    ] = useAppContext();
    const [catalogState, { actions: catalogActions }] = useCatalogContext();
    const [, { getUserDetails }] = useUserContext();
    const fetchUserDetails = useAwaitQuery(getCustomerQuery);

    // Request data from server
    useEffect(() => {
        getUserDetails({ fetchUserDetails });
    }, [fetchUserDetails, getUserDetails]);

    const { storeConfigData: getRootCategoryData } = useStoreConfigContext();

    const rootCategoryId = useMemo(() => {
        if (getRootCategoryData) {
            return getRootCategoryData.storeConfig.root_category_id;
        }
    }, [getRootCategoryData]);

    const isOpen = drawer === 'nav';

    // Display overlay depends on open state
    useEffect(() => {
        if (!showAuthModal) {
            setOverlayWithoutHeader(isOpen);
        }
    }, [isOpen, setOverlayWithoutHeader, showAuthModal]);

    // Close nav drawer if overlay close (happens when press on overlay)
    useEffect(() => {
        if (!overlayWithoutHeader) {
            closeAllNavigation();
            closeDrawer();
        }
    }, [closeAllNavigation, closeDrawer, overlayWithoutHeader]);

    const { categories } = catalogState;

    // Get local state
    const [view, setView] = useState('MENU');
    const [categoryId, setCategoryId] = useState(rootCategoryId);

    useEffect(() => {
        // On a fresh render with cold cache set the current category as root
        // Once the root category query completes.
        if (rootCategoryId && !categoryId) {
            setCategoryId(rootCategoryId);
        }
    }, [categoryId, rootCategoryId]);

    // Define local variables
    const category = categories[categoryId];
    const isTopLevel = categoryId === rootCategoryId;
    const hasModal = view !== 'MENU';

    // Define handlers
    const handleBack = useCallback(() => {
        const parent = ancestors[view];

        if (parent) {
            setView(parent);
        } else if (category && !isTopLevel) {
            setCategoryId(category.parentId);
        } else {
            closeDrawer();
        }
    }, [category, closeDrawer, isTopLevel, view]);

    const { setShimmerType } = useInternalLink('category');

    const handleClose = useCallback(() => {
        closeDrawer();
        // Sets next root component to show proper loading effect
        setShimmerType();
    }, [closeDrawer, setShimmerType]);

    // Create callbacks for local state
    const showCreateAccount = useCallback(() => {
        setView('CREATE_ACCOUNT');
    }, [setView]);
    const showForgotPassword = useCallback(() => {
        setView('FORGOT_PASSWORD');
    }, [setView]);
    const showMainMenu = useCallback(() => {
        setView('MENU');
    }, [setView]);
    const showMyAccount = useCallback(() => {
        setView('MENU');
    }, [setView]);
    const showSignIn = useCallback(() => {
        setView('SIGN_IN');
    }, [setView]);

    return {
        catalogActions,
        categoryId,
        handleBack,
        handleClose,
        hasModal,
        isOpen,
        isTopLevel,
        setCategoryId,
        showCreateAccount,
        showForgotPassword,
        showMainMenu,
        showMyAccount,
        showSignIn,
        view
    };
};
