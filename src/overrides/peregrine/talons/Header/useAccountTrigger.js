import { useCallback } from 'react';

import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useAccountTrigger = () => {
    const [
        { showAuthModal },
        {
            actions: { setShowAuthModal }
        }
    ] = useAppContext();

    const handleTriggerClick = useCallback(() => {
        !showAuthModal && setShowAuthModal(!showAuthModal);
    }, [showAuthModal, setShowAuthModal]);

    return {
        showAuthModal,
        handleTriggerClick
    };
};
