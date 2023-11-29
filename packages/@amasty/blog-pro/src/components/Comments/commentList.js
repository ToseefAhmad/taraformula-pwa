import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import CommentItem from './commentItem';
import defaultClasses from './comments.css';

const CommentList = props => {
  const { comments, talonProps } = props;

  if (!comments || !comments.length) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const commentList = comments.map(item => (
    <div className={classes.itemRoot} key={item.comment_id}>
      <CommentItem {...item} talonProps={talonProps} />
      {item.children && (
        <CommentList comments={item.children} talonProps={talonProps} />
      )}
    </div>
  ));

  return <div className={classes.listRoot}>{commentList}</div>;
};

export default CommentList;
