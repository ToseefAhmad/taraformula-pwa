import React from 'react';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import { useScrollLock } from '@magento/peregrine';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/Dialog/dialog.module.css';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { X as CloseIcon } from 'react-feather';
import Button from '@magento/venia-ui/lib/components/Button';
import { FormattedMessage } from 'react-intl';
import { bool, func, array, string } from 'prop-types';

const Modal = props => {
  const {
    children,
    confirmText,
    confirmTranslationId,
    isModal,
    isOpen,
    onCancel,
    onSubmit,
    shouldDisableAllButtons,
    shouldDisableConfirmButton,
    shouldUnmountOnHide,
    title,
    shouldShowButton
  } = props;

  // Prevent the page from scrolling in the background
  // when the Dialog is open.
  useScrollLock(isOpen);

  const classes = mergeClasses(defaultClasses, props.classes);
  const rootClass = isOpen ? classes.root_open : classes.root;
  const isMaskDisabled = shouldDisableAllButtons || isModal;
  const confirmButtonDisabled =
    shouldDisableAllButtons || shouldDisableConfirmButton;

  const confirmButtonClasses = {
    root_highPriority: classes.confirmButton
  };

  const maybeCloseXButton = !isModal ? (
    <button
      className={classes.headerButton}
      disabled={shouldDisableAllButtons}
      onClick={onCancel}
      type="reset"
    >
      <Icon src={CloseIcon} />
    </button>
  ) : null;

  const maybeButtons = shouldShowButton ? (
    <div className={classes.buttons}>
      <Button
        onClick={onSubmit}
        classes={confirmButtonClasses}
        disabled={confirmButtonDisabled}
        priority="high"
        type="button"
      >
        <FormattedMessage
          id={confirmTranslationId}
          defaultMessage={confirmText}
        />
      </Button>
    </div>
  ) : null;

  const maybeForm =
    isOpen || !shouldUnmountOnHide ? (
      <div className={classes.form}>
        {/* The Mask. */}
        <button
          className={classes.mask}
          disabled={isMaskDisabled}
          onClick={onCancel}
          type="reset"
        />
        {/* The Dialog. */}
        <div className={classes.dialog}>
          <div className={classes.header}>
            <span className={classes.headerText}>{title}</span>
            {maybeCloseXButton}
          </div>
          <div className={classes.body}>
            <div className={classes.contents}>{children}</div>
            {maybeButtons}
          </div>
        </div>
      </div>
    ) : null;

  return (
    <Portal>
      <aside className={rootClass}>{maybeForm}</aside>
    </Portal>
  );
};

Modal.propTypes = {
  children: array,
  confirmText: string,
  confirmTranslationId: string,
  isModal: bool,
  isOpen: bool,
  onCancel: func,
  onSubmit: func,
  shouldDisableAllButtons: bool,
  shouldDisableConfirmButton: bool,
  shouldUnmountOnHide: bool,
  title: string,
  shouldShowButton: bool
};

export default Modal;
