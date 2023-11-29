import { useState, useEffect } from 'react';

import { useScrollLock } from '@magento/peregrine';
import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useEditModal = () => {
    const [{ drawer }, { closeDrawer }] = useAppContext();
    const isOpen = drawer === 'shippingInformation.edit';

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        !isOpen && setIsLoading(false);
    }, [isOpen]);

    useScrollLock(isOpen);

    return {
        handleClose: closeDrawer,
        isOpen,
        isLoading,
        setIsLoading
    };
};
