import { array, func, number, shape, string } from 'prop-types';
import React from 'react';

import ShowMore from '@app/components/Blog/ShowMore';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './list.module.css';
import Post from './post';

const Posts = props => {
    const { items, pageControl } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const posts = items.map(item => <Post post={item} key={item.post_id} />);

    return (
        <div className={classes.root}>
            <div className={classes.layout}>{posts}</div>
            <ShowMore pageControl={pageControl} />
        </div>
    );
};

Posts.propTypes = {
    items: array,
    pageControl: shape({
        currentPage: number,
        setPage: func,
        totalPages: number
    }).isRequired,
    classes: shape({
        root: string,
        layout: string
    })
};

export default Posts;
