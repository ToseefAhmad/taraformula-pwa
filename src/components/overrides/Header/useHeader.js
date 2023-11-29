import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

export const useHeader = () => {
    const [{ hasBeenOffline, isOnline, isPageLoading }] = useAppContext();
    const { formatMessage } = useIntl();
    const [translationReady, setTranslationReady] = useState(false);
    const [selectingCountry, setSelectingCountry] = useState(false);

    const {
        elementRef: searchRef,
        expanded: isSearchOpen,
        setExpanded: setIsSearchOpen,
        triggerRef: searchTriggerRef
    } = useDropdown();

    const [
        ,
        {
            actions: { setOverlayWithoutHeader }
        }
    ] = useAppContext();

    const translation = formatMessage({
        id: 'global.philosophy',
        defaultMessage: 'loading'
    });

    // Check if defaultMessage was replaces with i18
    useEffect(() => {
        if (translation !== 'loading') {
            setTranslationReady(true);
        } else {
            setTranslationReady(false);
        }
    }, [translation]);

    const handleSearchTriggerClick = useCallback(
        isOpen => {
            if (typeof isOpen === 'boolean') {
                setIsSearchOpen(isOpen);
            } else {
                // Toggle the Search input form.
                setIsSearchOpen(isOpen => !isOpen);
            }
        },
        [setIsSearchOpen]
    );

    const toggleSelectingCountry = useCallback(() => setSelectingCountry(!selectingCountry), [selectingCountry]);

    const closeAllNavigation = useCallback(() => {
        setSelectingCountry(false);
        setOverlayWithoutHeader(false);
    }, [setOverlayWithoutHeader]);

    // Hide overlay if search closed
    useEffect(() => {
        if (!isSearchOpen) {
            setOverlayWithoutHeader(false);
        }
    }, [isSearchOpen, setOverlayWithoutHeader]);

    return {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        isPageLoading,
        isSearchOpen,
        searchRef,
        searchTriggerRef,
        translationReady,
        selectingCountry,
        toggleSelectingCountry,
        closeAllNavigation
    };
};
