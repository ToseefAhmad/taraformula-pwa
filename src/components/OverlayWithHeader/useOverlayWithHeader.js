import { useCallback } from 'react';

import { useScrollLock } from '@magento/peregrine';
import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useOverlayWithHeader = () => {
    const [
        { overlayWithHeader },
        {
            actions: { setOverlayWithHeader }
        }
    ] = useAppContext();

    // Toggle scroll lock
    useScrollLock(overlayWithHeader);

    // Close drawer
    const close = useCallback(() => {
        setOverlayWithHeader(false);
    }, [setOverlayWithHeader]);

    return {
        isOpen: overlayWithHeader,
        close
    };
};
