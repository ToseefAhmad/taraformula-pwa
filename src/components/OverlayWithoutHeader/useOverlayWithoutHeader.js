import { useCallback } from 'react';

import { useScrollLock } from '@magento/peregrine';
import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useOverlayWithoutHeader = () => {
    const [
        { overlayWithoutHeader },
        {
            actions: { setOverlayWithoutHeader }
        }
    ] = useAppContext();

    // Toggle scroll lock
    useScrollLock(overlayWithoutHeader);

    // Close drawer
    const close = useCallback(() => {
        setOverlayWithoutHeader(false);
    }, [setOverlayWithoutHeader]);

    return {
        isOpen: overlayWithoutHeader,
        close
    };
};
