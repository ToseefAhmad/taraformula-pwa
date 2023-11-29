import { useAmBlogProContext } from '../context';
import { useLocation, useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';
import { PAGE_TYPES, PAGE_TITLES } from '../constants';

const getItemByUrlKey = (urlKey, items) => {
  const list = Array.isArray(items) ? items : [];
  return list.find(({ url_key }) => url_key === urlKey);
};

export const useListPage = () => {
  const { id } = useParams();
  const { pageType, categories, tags, authors } = useAmBlogProContext();

  const location = useLocation();
  const query = getSearchParam('query', location);

  const config = useMemo(
    () => ({
      CATEGORY: categories,
      TAG: tags,
      AUTHOR: authors
    }),
    [categories, tags, authors]
  );

  const item = useMemo(() => {
    const items = config[pageType];

    if (!id || !items) {
      return null;
    }

    return getItemByUrlKey(id, items);
  }, [id, pageType, config]);

  const pageTitle = useMemo(() => {
    const title = PAGE_TITLES[pageType] ? PAGE_TITLES[pageType] : '';

    if (pageType === PAGE_TYPES.SEARCH) {
      return `${title} ${query}`;
    }

    return `${title} ${item ? item.name : ''}`;
  }, [pageType, query, item]);

  const itemId = item && item[`${pageType.toLowerCase()}_id`];

  return {
    ...item,
    itemId,
    pageType,
    pageTitle
  };
};
