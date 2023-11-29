import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import { func, number, object } from 'prop-types';

const Label = props => {
  const { message, handleClick, id } = props;

  return (
    <Fragment>
      {message.prevText && (
        <FormattedMessage
          id={`privacy.prevMessage${id}`}
          defaultMessage={message.prevText}
        />
      )}
      {message.text && (
        <LinkButton type="button" onClick={handleClick.bind(this, id)}>
          <FormattedMessage
            id={`privacy.link${id}`}
            defaultMessage={message.text}
          />
        </LinkButton>
      )}
      {message.afterText && (
        <FormattedMessage
          id={`privacy.afterMessage${id}`}
          defaultMessage={message.afterText}
        />
      )}
    </Fragment>
  );
};

Label.propTypes = {
  message: object,
  handleClick: func,
  id: number
};

export default Label;
