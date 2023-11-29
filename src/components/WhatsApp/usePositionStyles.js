import { useMemo } from 'react';

export const usePositionStyles = data => {
    return useMemo(() => {
        if (!data || !data.whatsappConfigs) {
            return null;
        }

        switch (data.whatsappConfigs.iconPosition) {
            case 'br':
                return {
                    bottom: '0',
                    right: '0'
                };
            case 'bl':
                return {
                    bottom: '0',
                    left: '0'
                };
            case 'tr':
                return {
                    top: '0',
                    right: '0'
                };
            case 'tl':
                return {
                    top: '0',
                    left: '0'
                };
            default:
                return {};
        }
    }, [data]);
};
