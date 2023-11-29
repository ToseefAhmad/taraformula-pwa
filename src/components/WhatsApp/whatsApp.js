import React, { useMemo } from 'react';

import { whatsAppLogo as WhatsAppLogo } from '@app/components/Icons';
import { usePositionStyles } from '@app/components/WhatsApp/usePositionStyles';
import { useWhatsAppConfigs } from '@app/components/WhatsApp/useWhatsAppConfigs';
import Icon from '@magento/venia-ui/lib/components/Icon/icon';

import defaultClasses from './whatsApp.module.css';

const WhatsApp = () => {
    const { data, loading, error } = useWhatsAppConfigs();
    const positionStyles = usePositionStyles(data);

    return useMemo(() => {
        // Still loading or Error. Don't render whatsapp
        if (loading || error) {
            return null;
        }

        // Data object returned ignore if not enabled
        if (!data || !data.whatsappConfigs || !data.whatsappConfigs.enabled) {
            return null;
        }

        const whatsappConfigs = data.whatsappConfigs;

        return (
            <a href={`https://wa.me/${whatsappConfigs.number}?text=${whatsappConfigs.defaultMessage}`}>
                <div
                    className={defaultClasses.container}
                    style={{
                        ...positionStyles,
                        width: whatsappConfigs.iconWidth,
                        margin: whatsappConfigs.iconMargin
                    }}
                >
                    <Icon src={WhatsAppLogo} />
                </div>
            </a>
        );
    }, [data, loading, error, positionStyles]);
};

export default WhatsApp;
