import { useCallback, useRef } from 'react';

export const useCarousel = () => {
    const dragging = useRef(false);

    const handleBeforeChange = useCallback(() => {
        dragging.current = true;
    }, []);

    const handleAfterChange = useCallback(() => {
        dragging.current = false;
    }, []);

    const handleOnItemClick = useCallback(e => {
        if (dragging.current) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, []);

    return {
        handleBeforeChange,
        handleAfterChange,
        handleOnItemClick
    };
};
