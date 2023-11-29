import { bool, func, array } from 'prop-types';
import React from 'react';

import Carousel from './Carousel';
import classes from './complimentaryGift.module.css';
import Modal from './Modal';

const ComplimentaryGift = ({
    showModal,
    setShowModal,
    complimentaryGiftData,
    setComplimentaryGiftModalSeen,
    handleAddComplimentaryGift
}) => {
    const modalChildren = (
        <Carousel items={complimentaryGiftData} handleAddComplimentaryGift={handleAddComplimentaryGift} />
    );

    return (
        <div className={classes.root}>
            <Modal
                title="Complimentary gift"
                showModal={showModal}
                setShowModal={setShowModal}
                setComplimentaryGiftModalSeen={setComplimentaryGiftModalSeen}
            >
                {modalChildren}
            </Modal>
        </div>
    );
};

ComplimentaryGift.propTypes = {
    complimentaryGiftData: array,
    handleAddComplimentaryGift: func,
    setComplimentaryGiftModalSeen: func,
    setShowModal: func,
    showModal: bool
};

export default ComplimentaryGift;
