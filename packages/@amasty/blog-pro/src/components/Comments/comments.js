import React, { createContext, useContext } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { useComments } from '../../talons/useComments';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import CommentList from './commentList';
import CommentForm from './commentForm';
import { number } from 'prop-types';
import defaultClasses from './comments.css';

const CommentContext = createContext();
const { Provider } = CommentContext;

const Comments = props => {
  const { postId } = props;
  const talonProps = useComments({ postId });
  const classes = mergeClasses(defaultClasses, props.classes);

  const { loading, comments } = talonProps;

  if (loading) {
    return <LoadingIndicator />;
  }

  const contextValue = { ...talonProps };

  return (
    <Provider value={contextValue}>
      <div className={classes.root}>
        <div className={classes.title}>Comments</div>
        <CommentList comments={comments} />
        <CommentForm postId={+postId} />
      </div>
    </Provider>
  );
};

Comments.propTypes = {
  postId: number.isRequired
};

export default Comments;

export const useCommentContext = () => useContext(CommentContext);
