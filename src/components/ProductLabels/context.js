import PropTypes, { string } from 'prop-types';
import React, { createContext, useContext } from 'react';

import { useLabels } from './useLabels';

const AmProductLabelContext = createContext(undefined);
const { Provider } = AmProductLabelContext;

const AmProductLabelProvider = props => {
    const { products, productsFromVariants, children, mode, specialWidth } = props;

    const talonProps = useLabels({
        products,
        productsFromVariants,
        mode
    });

    const { error } = talonProps;

    if (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
    }

    const contextValue = {
        ...talonProps,
        specialWidth
    };

    return <Provider value={contextValue}>{children}</Provider>;
};

AmProductLabelProvider.propTypes = {
    products: PropTypes.any,
    productsFromVariants: PropTypes.any,
    children: PropTypes.object,
    mode: string,
    specialWidth: PropTypes.number
};
export default AmProductLabelProvider;

export const useAmProductLabelContext = () => useContext(AmProductLabelContext);
