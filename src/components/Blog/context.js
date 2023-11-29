import { useBlog } from '@amasty/blog-pro/src/talons/useBlog';
import { object, shape, string } from 'prop-types';
import React, { createContext, useContext } from 'react';

import { GET_BLOG_INFO_QUERY } from '@app/components/Blog/queries/getSettings.ggl.js';

const AmBlogProContext = createContext();
const { Provider } = AmBlogProContext;

const AmBlogProProvider = ({ children }) => {
    const talonProps = useBlog({
        query: GET_BLOG_INFO_QUERY
    });

    const { error } = talonProps;

    if (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
    }

    const contextValue = {
        ...talonProps
    };

    return <Provider value={contextValue}>{children}</Provider>;
};
AmBlogProProvider.propTypes = {
    children: shape({
        type: string,
        props: object
    })
};

export default AmBlogProProvider;

export const useAmBlogProContext = () => useContext(AmBlogProContext);
