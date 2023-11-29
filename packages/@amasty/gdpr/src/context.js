import React, { createContext, useContext } from 'react';
import { useAmCheckbox } from './talons/useAmCheckbox';

const amGdprContext = createContext();
const { Provider } = amGdprContext;

const AmGdprContextProvider = props => {
  const { children } = props;

  const contextValue = useAmCheckbox();
  const { error } = contextValue;

  if (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }

    console.log('Check if Amasty modules has been installed!');
  }

  return <Provider value={contextValue}>{children}</Provider>;
};

export default AmGdprContextProvider;

export const useAmGdprContext = () => useContext(amGdprContext);
