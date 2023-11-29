import React, { useMemo } from 'react';
import Tree from './tree';
import { array, bool, string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './categoryTree.css';
import { useAmBlogProContext } from '../../context';
import { buildTree } from '../../utils';
import { useAccordion } from '../../talons/useAccordion';
import Trigger from '@magento/venia-ui/lib/components/Trigger';

const CategoryTree = props => {
  const { categories } = useAmBlogProContext() || {};
  const { title, accordionEnabled } = props;
  const classes = mergeClasses(defaultClasses, props.classes);

  const categoriesTree = useMemo(() => {
    if (!Array.isArray(categories) || !categories.length) {
      return null;
    }

    return buildTree({ items: categories });
  }, [categories]);

  const { isOpen, handleToggle } = useAccordion({ accordionEnabled });

  return (
    <div className={`${classes.root} ${classes.gridArea}`}>
      <div className={classes.title}>
        <Trigger action={handleToggle}>{title}</Trigger>
      </div>

      {isOpen && <Tree categories={categoriesTree} classes={classes} />}
    </div>
  );
};

CategoryTree.propTypes = {
  categories: array,
  title: string,
  accordionEnabled: bool
};

CategoryTree.defaultProps = {
  categories: [],
  title: 'Categories',
  accordionEnabled: false
};

export default CategoryTree;
