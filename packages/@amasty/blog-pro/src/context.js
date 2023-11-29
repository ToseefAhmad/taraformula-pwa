import React, { createContext, useContext } from 'react';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useBlog } from './talons/useBlog';
import GET_BLOG_INFO_QUERY from './queries/getSettings.graphql';

const AmBlogProContext = createContext();
const { Provider } = AmBlogProContext;

const AmBlogProProvider = props => {
  const { children } = props;

  const talonProps = useBlog({
    query: GET_BLOG_INFO_QUERY
  });

  const { error, loading } = talonProps;

  if (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }

    console.log('Check if Amasty modules has been installed!');
  }

  if (loading) {
    return fullPageLoadingIndicator;
  }

  const contextValue = {
    ...talonProps
  };

  return <Provider value={contextValue}>{children}</Provider>;
};

export default AmBlogProProvider;

export const useAmBlogProContext = () => useContext(AmBlogProContext);
