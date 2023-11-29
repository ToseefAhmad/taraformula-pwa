import React, { lazy, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PAGE_TYPES } from '../../constants';

const Home = lazy(() => import('../HomePage'));
const Post = lazy(() => import('../PostPage'));
const ListPage = lazy(() => import('../ListPage'));

const MainContent = () => {
  const { slug } = useParams();

  const Page = useMemo(() => {
    if (!slug) {
      return Home;
    }

    return PAGE_TYPES[slug.toUpperCase()] ? ListPage : Post;
  }, [slug]);

  return <Page />;
};

export default MainContent;
