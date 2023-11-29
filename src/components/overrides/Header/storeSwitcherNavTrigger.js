import PropTypes from 'prop-types';
import React from 'react';

import { Close as CloseIcon, ArrowLeft } from '@app/components/Icons';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './storeSwitcherNavTrigger.module.css';

const StoreSwitcherNavTrigger = ({ toggleSelectingCountry, closeAllNavigation }) => {
    const classes = useStyle(defaultClasses);

    const backIcon = <Icon classes={{ root: '', icon: classes.iconBack }} src={ArrowLeft} size={15} />;
    const closeIcon = <Icon classes={{ root: '', icon: classes.iconClose }} src={CloseIcon} size={15} />;

    return (
        <div className={classes.actionContainer}>
            <button onClick={toggleSelectingCountry} className={classes.backIcon}>
                {backIcon}
            </button>
            <button onClick={closeAllNavigation} className={classes.closeIcon}>
                {closeIcon}
            </button>
        </div>
    );
};

export default StoreSwitcherNavTrigger;

StoreSwitcherNavTrigger.propTypes = {
    toggleSelectingCountry: PropTypes.func,
    closeAllNavigation: PropTypes.func
};
