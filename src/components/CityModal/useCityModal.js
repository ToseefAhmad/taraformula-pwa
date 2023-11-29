import { useCallback, useEffect, useState } from 'react';

import { useScreenSize } from '@app/hooks/useScreenSize';
import { useScrollLock } from '@magento/peregrine';
import { useAppContext } from '@magento/peregrine/lib/context/app';

const DRAWER_NAME = 'cities';

export const UseCityModal = () => {
    const [
        { drawer, overlayWithHeader },
        {
            toggleDrawerWithoutMask,
            actions: { setOverlayWithoutHeader, setOverlayWithHeader }
        }
    ] = useAppContext();
    const [isOpen, setIsOpen] = useState(drawer === DRAWER_NAME);
    const { isDesktopXlScreen } = useScreenSize();

    // Open or close the drawer
    const handleToggle = useCallback(() => {
        toggleDrawerWithoutMask(drawer === DRAWER_NAME ? null : DRAWER_NAME);
    }, [drawer, toggleDrawerWithoutMask]);

    // Close popup
    const closeModal = useCallback(() => {
        setIsOpen(false);
        toggleDrawerWithoutMask(null);
    }, [setIsOpen, toggleDrawerWithoutMask]);

    // If opened, for desktop set overlay for whole background. For mobile, overlay doesn't cover header.
    useEffect(() => {
        if (isDesktopXlScreen) {
            setOverlayWithHeader(isOpen);
        } else {
            setOverlayWithoutHeader(isOpen);
        }
    }, [isOpen, setOverlayWithoutHeader, isDesktopXlScreen, setOverlayWithHeader]);

    useEffect(() => {
        setIsOpen(drawer === DRAWER_NAME);
    }, [drawer]);

    // If overlay was closed, then close popup as well
    useEffect(() => {
        if (isDesktopXlScreen && !overlayWithHeader) {
            closeModal();
        }
    }, [isDesktopXlScreen, overlayWithHeader, closeModal]);

    // Lock scrolling if drawer is opened
    useScrollLock(isOpen);

    return {
        isOpen,
        handleToggle
    };
};
