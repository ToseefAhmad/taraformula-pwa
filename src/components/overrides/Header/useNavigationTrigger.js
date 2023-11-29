import { useCallback, useEffect, useState } from 'react';

import { useScreenSize } from '@app/hooks/useScreenSize';
import { useScrollLock } from '@magento/peregrine';
import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useNavigationTrigger = () => {
    const [appState, { toggleDrawerWithoutMask }] = useAppContext();
    const { drawer, showAuthModal, isPageLoading } = appState;
    const [isOpen, setIsOpen] = useState(drawer === 'nav');
    const { isDesktopXlScreen } = useScreenSize();

    // Toggle drawer
    const handleOpenNavigation = useCallback(() => {
        if (!isPageLoading) {
            toggleDrawerWithoutMask(drawer === 'nav' ? null : 'nav');
        }
    }, [isPageLoading, drawer, toggleDrawerWithoutMask]);

    // Hide drawer if opened and desktop
    useEffect(() => {
        if (isOpen && isDesktopXlScreen) {
            toggleDrawerWithoutMask(null);
        }
    }, [isOpen, isDesktopXlScreen, toggleDrawerWithoutMask]);

    // Update isOpen depends on drawer
    useEffect(() => {
        setIsOpen(drawer === 'nav');
    }, [drawer]);

    // Keep scroll lock depending on isOpen
    useScrollLock(isOpen || showAuthModal);

    return {
        handleOpenNavigation,
        isOpen
    };
};
