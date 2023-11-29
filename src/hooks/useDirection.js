import { oneOf } from 'prop-types';
import { useEffect, useMemo } from 'react';

import { useLocale } from '@app/hooks/useLocale/useLocale';
import { isLanguageRtl } from '@app/util/isLanguageRtl';

export const Directions = {
    ltr: 'ltr',
    rtl: 'rtl',
    default: 'default'
};

export const getDirection = () => {
    return document.body.getAttribute('dir');
};

const useDirection = propDirection => {
    const { currentStoreLocale } = useLocale();

    const direction = useMemo(() => {
        let direction = propDirection === Directions.rtl ? propDirection : Directions.ltr;

        if (!propDirection || propDirection === Directions.default) {
            direction = isLanguageRtl(currentStoreLocale) ? Directions.rtl : Directions.ltr;
        }

        return direction;
    }, [propDirection, currentStoreLocale]);

    useEffect(() => {
        document.body.setAttribute('dir', direction);
    }, [direction]);
};

useDirection.propTypes = {
    propDirection: oneOf(Object.values(Directions))
};

export default useDirection;
