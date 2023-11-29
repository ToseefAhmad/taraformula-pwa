import { string } from 'prop-types';
import React from 'react';

import classes from './cityModal.module.css';
import { UseCityModal } from './useCityModal';

const CityModalOpenButton = props => {
    const { text } = props;
    const { handleToggle } = UseCityModal();

    if (!text) {
        return null;
    }

    return (
        <span
            role={'button'}
            onClick={handleToggle}
            onKeyDown={() => undefined}
            className={classes.openButton}
            tabIndex={0}
        >
            <b>
                <u>{text}</u>
            </b>
        </span>
    );
};

CityModalOpenButton.propTypes = {
    text: string
};

export default CityModalOpenButton;
