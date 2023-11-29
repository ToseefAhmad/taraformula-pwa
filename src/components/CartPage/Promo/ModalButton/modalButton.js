import { func } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import classes from './modalButton.module.css';

const ModalButton = ({ setShowComplimentaryGiftModal }) => {
    return (
        <span
            className={classes.root}
            role={'button'}
            onClick={() => setShowComplimentaryGiftModal(true)}
            onKeyDown={() => setShowComplimentaryGiftModal(true)}
            tabIndex={0}
        >
            <FormattedMessage id={'promo.here'} defaultMessage={'HERE'} />
        </span>
    );
};

ModalButton.propTypes = {
    setShowComplimentaryGiftModal: func
};

export default ModalButton;
