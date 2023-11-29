import React, { Fragment, Suspense } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { FormattedMessage } from 'react-intl';
import defaultClasses from '../AccountPrivacySettings/accountPrivacySettings.css';
import PrivacyModal from '../PrivacyModal';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import { usePolicyButton } from '../../talons/usePolicyButton';

const PolicyButton = props => {
  const classes = mergeClasses(defaultClasses, props.classes);
  const {
    isShowMode,
    showUpdateMode,
    handleCancel,
    handleSubmit,
    modalContent
  } = usePolicyButton();

  return (
    <Fragment>
      <div className={classes.item}>
        <h3 className={classes.title}>{props.item.title}</h3>
        <LinkButton type="button" onClick={showUpdateMode}>
          <FormattedMessage
            id={`privacy.submitButton${props.index}`}
            defaultMessage={'Read Privacy Policy'}
          />
        </LinkButton>
      </div>
      <Suspense fallback={null}>
        <PrivacyModal
          isOpen={isShowMode}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          content={modalContent}
        />
      </Suspense>
    </Fragment>
  );
};

export default PolicyButton;
