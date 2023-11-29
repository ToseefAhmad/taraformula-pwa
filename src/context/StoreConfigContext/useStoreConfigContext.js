import { object } from 'prop-types';
import React, { createContext, useContext } from 'react';

import { useStoreConfig } from '@app/context/StoreConfigContext/useStoreConfig';

const StoreConfigContext = createContext();

export const StoreConfigContextProvider = ({ children }) => {
    const contextValue = useStoreConfig();

    return <StoreConfigContext.Provider value={contextValue}>{children}</StoreConfigContext.Provider>;
};

export const useStoreConfigContext = () => useContext(StoreConfigContext);

StoreConfigContextProvider.propTypes = {
    children: object
};
