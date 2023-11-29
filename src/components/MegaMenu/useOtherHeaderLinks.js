import { useIntl } from 'react-intl';

export const useOtherHeaderLinks = () => {
    const { formatMessage } = useIntl();

    return [
        {
            id: 262626,
            include_in_menu: 1,
            isActive: false,
            name: formatMessage({
                id: 'global.ingredients',
                defaultMessage: 'Ingredients'
            }),
            url_path: 'ingredients',
            children: [],
            path: [262626],
            position: 0
        },
        {
            id: 123456,
            include_in_menu: 1,
            isActive: false,
            name: formatMessage({
                id: 'global.philosophy',
                defaultMessage: 'Philosophy'
            }),
            url_path: 'philosophy',
            children: [],
            path: [123456],
            position: 0
        },
        {
            id: 9999999,
            include_in_menu: 1,
            isActive: false,
            name: formatMessage({
                id: 'global.journal',
                defaultMessage: 'Journal'
            }),
            url_path: 'blog',
            children: [],
            path: [9999999],
            position: 0
        }
    ];
};
