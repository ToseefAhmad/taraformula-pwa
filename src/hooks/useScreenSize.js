import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';

const SCREEN_DESKTOP_XL_PX = 1280;
const SCREEN_DESKTOP_PX = 1024;
const SCREEN_LG_TABLET_PX = 768;
const SCREEN_TABLET_PX = 640;
const SCREEN_MOBILE_PX = SCREEN_DESKTOP_PX - 1;

export const useScreenSize = () => {
    const { innerWidth } = useWindowSize();

    const isDesktopXlScreen = innerWidth >= SCREEN_DESKTOP_XL_PX;
    const isDesktopScreen = innerWidth >= SCREEN_DESKTOP_PX;
    const isMobileScreen = innerWidth <= SCREEN_MOBILE_PX;
    const isTabletScreen = innerWidth <= SCREEN_MOBILE_PX && innerWidth >= SCREEN_TABLET_PX;
    const isMiniTabletScreen = innerWidth >= SCREEN_TABLET_PX && innerWidth <= SCREEN_LG_TABLET_PX;
    const isTrueMobileScreen = innerWidth < SCREEN_TABLET_PX;

    return {
        isDesktopXlScreen,
        isDesktopScreen,
        isMobileScreen,
        isTabletScreen,
        isMiniTabletScreen,
        isTrueMobileScreen
    };
};
