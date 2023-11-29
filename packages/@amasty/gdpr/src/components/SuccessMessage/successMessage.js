import React from 'react';
import { string } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../SuccessMessage/successMessage.css';

const SuccessMessage = props => {
  const classes = mergeClasses(defaultClasses, props.classes);
  const { message } = props;

  if (!message) {
    return null;
  }

  return <p className={classes.root}>{message}</p>;
};

SuccessMessage.propTypes = {
  message: string
};

export default SuccessMessage;
