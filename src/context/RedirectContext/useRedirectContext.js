import { any } from 'prop-types';
import React, { createContext, useContext, useState } from 'react';

const RedirectContext = createContext();

export const RedirectContextProvider = ({ children }) => {
    const [isRedirectCompleted, setIsRedirectCompleted] = useState(false);
    const contextValue = { isRedirectCompleted, setIsRedirectCompleted };

    return <RedirectContext.Provider value={contextValue}>{children}</RedirectContext.Provider>;
};

export const useRedirectContext = () => useContext(RedirectContext);

RedirectContextProvider.propTypes = {
    children: any
};
