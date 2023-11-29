import { Form } from 'informed';
import { bool, func, string, object, node } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '@magento/venia-ui/lib/components/Button';

import classes from './dialog.module.css';

/**
 * The Address Book Dialog component shows its children content in a dialog,
 * encoding the look-and-feel and behavior in one place for consistency across the app.
 *
 * @typedef Dialog
 * @kind functional component
 *
 * @param {Object}  props
 * @param {String}  props.cancelText - The text to display on the Dialog cancel button.
 * @param {String}  props.cancelTranslationId - The id to assign for the cancel button translation.
 * @param {String}  props.confirmText - The text to display on the Dialog confirm button.
 * @param {String}  props.confirmTranslationId - The id to assign for the confirm button translation.
 * @param {Object}  props.formProps - Props to apply to the internal form. @see https://joepuzzo.github.io/informed/?path=/story/form--props.
 * @param {Boolean} props.isOpen - Whether the Dialog is currently showing.
 * @param {Func}    props.onCancel - A function to call when the user cancels the Dialog.
 * @param {Func}    props.onConfirm - A function to call when the user confirms the Dialog.
 * @param {Boolean} props.shouldDisableAllButtons - A toggle for whether the buttons should be disabled.
 * @param {Boolean} props.shouldDisableConfirmButton - A toggle for whether the confirm button should be disabled.
 *                                                     The final value is OR'ed with shouldDisableAllButtons.
 * @param {Boolean} props.shouldShowButtons - A toggle for whether the cancel and confirm buttons are visible.
 * @param {Boolean} props.shouldUnmountOnHide - A boolean to unmount child components on hide
 */
const Dialog = ({
    cancelText,
    cancelTranslationId,
    children,
    confirmText,
    confirmTranslationId,
    formProps,
    isOpen,
    onCancel,
    onConfirm,
    shouldDisableAllButtons,
    shouldDisableConfirmButton,
    shouldShowButtons,
    shouldUnmountOnHide,
    hasAddresses
}) => {
    const confirmButtonDisabled = shouldDisableAllButtons || shouldDisableConfirmButton;
    const cancelButtonClasses = {
        root_lowPriority: classes.cancelButton
    };
    const confirmButtonClasses = {
        root_highPriority: classes.confirmButton
    };

    const cancelButton = hasAddresses && (
        <Button
            classes={cancelButtonClasses}
            disabled={shouldDisableAllButtons}
            onClick={onCancel}
            priority="low"
            type="reset"
        >
            <FormattedMessage id={cancelTranslationId} defaultMessage={cancelText} />
        </Button>
    );

    const maybeButtons = shouldShowButtons && (
        <div className={classes.buttons}>
            <Button classes={confirmButtonClasses} disabled={confirmButtonDisabled} priority="high" type="submit">
                <FormattedMessage id={confirmTranslationId} defaultMessage={confirmText} />
            </Button>
            {cancelButton}
        </div>
    );

    return isOpen || !shouldUnmountOnHide ? (
        <Form {...formProps} onSubmit={onConfirm}>
            <div className={classes.dialog}>
                <div className={classes.contents}>{children}</div>
                <div className={classes.submit}>{maybeButtons}</div>
            </div>
        </Form>
    ) : null;
};

export default Dialog;

Dialog.propTypes = {
    children: node,
    cancelText: string,
    cancelTranslationId: string,
    confirmText: string,
    confirmTranslationId: string,
    formProps: object,
    isModal: bool,
    isOpen: bool,
    onCancel: func,
    onConfirm: func,
    shouldDisableAllButtons: bool,
    shouldDisableSubmitButton: bool,
    shouldUnmountOnHide: bool,
    title: node,
    shouldDisableConfirmButton: bool,
    shouldShowButtons: bool,
    hasAddresses: bool
};

Dialog.defaultProps = {
    cancelText: 'Cancel',
    cancelTranslationId: 'global.cancel',
    confirmText: 'Confirm',
    confirmTranslationId: 'global.confirm',
    isModal: false,
    shouldUnmountOnHide: true,
    shouldShowButtons: true
};
