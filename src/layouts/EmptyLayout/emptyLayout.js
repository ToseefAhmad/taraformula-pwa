import { node, oneOf } from 'prop-types';
import React from 'react';

import useCartRestore from '@app/hooks/useCartRestore';
import useDirection, { Directions } from '@app/hooks/useDirection';
import useLanguage from '@app/hooks/useLanguage';
import useUrlCleaner from '@app/hooks/useUrlCleaner';

const EmptyLayout = ({ direction, children }) => {
    useDirection(direction);
    useLanguage();
    useCartRestore();
    useUrlCleaner();

    return <>{children}</>;
};

EmptyLayout.propTypes = {
    direction: oneOf(Object.values(Directions)),
    children: node
};

export default EmptyLayout;
