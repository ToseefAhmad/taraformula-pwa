import { func, number, shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import Leaf from './categoryLeaf';
import defaultClasses from './categoryTree.module.css';
import useCategoryTree from './useCategoryTree';

const Tree = props => {
    const { categoryId, onNavigate, updateCategories } = props;

    const talonProps = useCategoryTree({
        categoryId,
        updateCategories
    });

    const { data, childCategories, categoryUrlSuffix } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    // For each child category, render a direct link if it has no children
    // Otherwise render a branch
    const branches = data
        ? Array.from(childCategories, childCategory => {
              const [id, { category }] = childCategory;
              return (
                  <Leaf key={id} category={category} onNavigate={onNavigate} categoryUrlSuffix={categoryUrlSuffix} />
              );
          })
        : null;

    return (
        <div className={classes.root}>
            <ul className={classes.tree}>{branches}</ul>
        </div>
    );
};

export default Tree;

Tree.propTypes = {
    categoryId: number,
    classes: shape({
        root: string,
        tree: string
    }),
    onNavigate: func.isRequired,
    setCategoryId: func.isRequired,
    updateCategories: func.isRequired
};
