import React, { Fragment } from 'react';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { PAGE_TYPES } from '../../constants';
import { useList } from '../../talons/useList';
import { string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './list.css';
import Posts from './posts';
import { usePageBuilder } from '../../talons/usePagebuilder';

const NO_ITEMS_MESSAGE = 'There are no posts yet.';

const List = props => {
  const { id } = props;
  const { loading, error, items, pageControl } = useList({ id });
  const classes = mergeClasses(defaultClasses, props.classes);
  const { sections } = usePageBuilder();

  const { main } = sections || {};

  if (loading) {
    return <LoadingIndicator />;
  }

  const hasGrid = main.includes('grid');
  const hasList = main.includes('list');

  if (error || !items || !items.length) {
    return (
      <div
        className={`${hasList && classes.root} ${hasGrid && classes.gridRoot}`}
      >
        <p className={classes.noItems}>{NO_ITEMS_MESSAGE}</p>
      </div>
    );
  }

  return (
    <Fragment>
      {hasList && <Posts items={items} pageControl={pageControl} />}
      {hasGrid && (
        <Posts
          items={items}
          pageControl={pageControl}
          classes={{ root: classes.gridRoot }}
        />
      )}
    </Fragment>
  );
};

List.propTypes = {
  pageType: string
};

List.defaultProps = {
  pageType: PAGE_TYPES.ALL
};

export default List;
