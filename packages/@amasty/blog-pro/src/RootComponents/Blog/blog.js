import React from 'react';

import PageBuilder from '../../components/PageBuilder';
import AmBlogProProvider from '../../context';

const Blog = () => {
  return (
    <AmBlogProProvider>
      <PageBuilder />
    </AmBlogProProvider>
  );
};

export default Blog;
