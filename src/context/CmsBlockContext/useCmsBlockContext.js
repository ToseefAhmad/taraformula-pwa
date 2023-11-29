import { object } from 'prop-types';
import React, { createContext, useContext } from 'react';

import { useCmsBlock } from '@app/context/CmsBlockContext/useCmsBlock';

const CmsBlockContext = createContext();

export const CmsBlockContextProvider = ({ children }) => {
    const contextValue = useCmsBlock();

    return <CmsBlockContext.Provider value={contextValue}>{children}</CmsBlockContext.Provider>;
};

export const useCmsBlockContext = () => useContext(CmsBlockContext);

CmsBlockContextProvider.propTypes = {
    children: object
};
