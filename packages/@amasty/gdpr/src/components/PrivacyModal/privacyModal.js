import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { FormattedMessage, useIntl } from 'react-intl';
import defaultClasses from './privacyModal.css';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Modal from '../Modal';
import { bool, func, object, string } from 'prop-types';

const PrivacyModal = props => {
  const {
    onCancel,
    onSubmit,
    isOpen,
    content = {},
    location,
    isVersionChanged
  } = props;
  const { formatMessage } = useIntl();
  const classes = mergeClasses(defaultClasses, props.classes);

  if (!content.content) {
    return null;
  }

  const versionChanged = isVersionChanged && (
    <p className={classes.versionChanged}>
      <FormattedMessage
        id={`privacy.versionChanged`}
        defaultMessage={
          'We would like to inform you that our Privacy Policy has been amended. Please, read and accept the new terms.'
        }
      />
    </p>
  );

  return (
    <Modal
      confirmTranslationId={'privacySetting.accept'}
      classes={{
        cancelButton: classes.cancelButton,
        dialog: classes.dialog,
        body: classes.body
      }}
      confirmText="I have read and accept"
      shouldShowButton={location !== 'registration'}
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={onSubmit}
      shouldUnmountOnHide={true}
      title={formatMessage({
        id: 'privacySetting.privacyModal',
        defaultMessage: content.title || 'Privacy Policy'
      })}
    >
      {versionChanged}
      <RichContent
        classes={{ root: classes.richContent }}
        html={content.content}
      />
    </Modal>
  );
};

PrivacyModal.propTypes = {
  isOpen: bool,
  onCancel: func,
  onSubmit: func,
  content: object,
  location: string
};

export default PrivacyModal;
