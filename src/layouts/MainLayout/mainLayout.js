import { node, oneOf } from 'prop-types';
import React from 'react';

import useCartRestore from '@app/hooks/useCartRestore';
import useDirection, { Directions } from '@app/hooks/useDirection';
import useLanguage from '@app/hooks/useLanguage';
import useUrlCleaner from '@app/hooks/useUrlCleaner';
import Main from '@magento/venia-ui/lib/components/Main';

import { useMainLayout } from './useMainLayout';

const MainLayout = ({ direction, children }) => {
    const { hasOverlay } = useMainLayout();

    useDirection(direction);
    useLanguage();
    useCartRestore();
    useUrlCleaner();

    return <Main isMasked={hasOverlay}>{children}</Main>;
};

MainLayout.propTypes = {
    direction: oneOf(Object.values(Directions)),
    children: node
};

export default MainLayout;
