import { useNavLink } from '@amasty/blog-pro/src/talons/useNavLink';

const wrapUseMegaMenu = original => props => {
    const defaultReturnData = original(props);
    const { label, isEnabled, urlKey } = useNavLink();

    const { megaMenuData } = defaultReturnData;

    if (isEnabled) {
        const { children = [] } = megaMenuData;

        // Not working with random id
        const blogItem = {
            id: 9999999,
            include_in_menu: 1,
            isActive: false,
            name: label || '',
            url_path: urlKey,
            children: [],
            path: [9999999],
            position: 0
        };

        return {
            ...defaultReturnData,
            megaMenuData: {
                ...megaMenuData,
                children: [...children, blogItem]
            }
        };
    }

    return {
        ...defaultReturnData
    };
};

export default wrapUseMegaMenu;
