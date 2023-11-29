import { string, node, bool, func } from 'prop-types';
import React, { useEffect, useCallback } from 'react';
import { X } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './modal.module.css';

const Modal = ({ children, title, showModal, setShowModal, setComplimentaryGiftModalSeen, ...props }) => {
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);
    const handleScrollLock = useCallback(() => {
        e => {
            e.preventDefault();
            window.scrollTo(0, 0);
        };
    }, []);

    useEffect(() => {
        if (showModal) {
            document.body.classList.add('modal-open');
            window.addEventListener('scroll', handleScrollLock);
        } else {
            document.body.classList.remove('modal-open');
            window.removeEventListener('scroll', handleScrollLock);
        }

        return window.removeEventListener('scroll', handleScrollLock);
    }, [showModal, handleScrollLock]);

    const toggleModal = () => {
        setComplimentaryGiftModalSeen(true);
        setShowModal(!showModal);
    };

    const stopPropagation = e => {
        e.stopPropagation();
    };

    const rejectButton = (
        <Button
            aria-label={formatMessage({
                id: 'complimentaryGift.noThanks',
                defaultMessage: 'No thanks'
            })}
            onPress={() => {
                toggleModal();
            }}
            type="button"
            fill="outline"
            priority="secondary"
        >
            <span>
                <FormattedMessage id={'complimentaryGift.noThanks'} defaultMessage={'No thanks'} />
            </span>
        </Button>
    );

    return (
        showModal && (
            <div className={classes.modal}>
                <div
                    className={classes.modalOverlay}
                    onClick={toggleModal}
                    role="button"
                    onKeyDown={toggleModal}
                    tabIndex={0}
                >
                    <div
                        onClick={stopPropagation}
                        className={classes.modalContent}
                        role="button"
                        tabIndex={0}
                        onKeyDown={stopPropagation}
                    >
                        <button className={classes.closeButton} onClick={toggleModal}>
                            <Icon size={32} src={X} />
                        </button>
                        <div className={classes.header}>
                            <h2 className={classes.headerTitle}>
                                {<FormattedMessage id={'complimentaryGift.title'} defaultMessage={title} />}
                            </h2>
                        </div>
                        <div className={classes.subHeaderTitle}>
                            <FormattedMessage
                                id={'complimentaryGift.subTitle'}
                                defaultMessage={
                                    'You’ve earned a complimentary gift! Please select one to add to your bag.'
                                }
                            />
                        </div>
                        <div className={classes.body}>{children}</div>
                        <div className={classes.rejectButtonWrapper}>{rejectButton}</div>
                    </div>
                </div>
            </div>
        )
    );
};

Modal.propTypes = {
    children: node,
    classes: string,
    title: string,
    showModal: bool,
    setComplimentaryGiftModalSeen: func,
    setShowModal: func
};

export default Modal;
