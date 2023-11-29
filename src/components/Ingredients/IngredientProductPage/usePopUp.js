import { useCallback, useState } from 'react';

export const usePopUp = () => {
    const [popUpOpen, setPopUpOpen] = useState(false);

    const handleOpenPopUp = useCallback(() => {
        setPopUpOpen(true);
    }, [setPopUpOpen]);

    const handleClosePopUp = useCallback(() => {
        setPopUpOpen(false);
    }, [setPopUpOpen]);

    return {
        popUpOpen,
        handleClosePopUp,
        handleOpenPopUp
    };
};
