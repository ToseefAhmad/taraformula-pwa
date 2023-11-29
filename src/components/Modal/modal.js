import { string, node, bool, func } from 'prop-types';
import React, { useEffect, useCallback } from 'react';
import { X } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './modal.module.css';

const Modal = ({ children, title, showModal, setShowModal, ...props }) => {
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
        setShowModal(!showModal);
    };

    const stopPropagation = e => {
        e.stopPropagation();
    };

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
                        <div className={classes.header}>
                            <div className={classes.headerTitle}>{title}</div>
                            <button className={classes.closeButton} onClick={toggleModal}>
                                <Icon size={32} src={X} />
                            </button>
                        </div>
                        <div className={classes.body}>{children}</div>
                    </div>
                </div>
            </div>
        )
    );
};

Modal.propTypes = {
    classes: string,
    children: node,
    title: string,
    showModal: bool,
    setShowModal: func
};

export default Modal;
