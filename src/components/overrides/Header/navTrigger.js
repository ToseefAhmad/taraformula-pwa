import PropTypes, { node, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { UseCityModal } from '@app/components/CityModal/useCityModal';
import { Hamburger as HamburgerIcon, Close as CloseIcon } from '@app/components/Icons';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './navTrigger.module.css';
import { useNavigationTrigger } from './useNavigationTrigger';

/**
 * A component that toggles the navigation menu.
 */
const NavigationTrigger = props => {
    const { formatMessage } = useIntl();
    const { handleOpenNavigation, isOpen: navigationIsOpen } = useNavigationTrigger();
    const { handleToggle: handleOpenCityModal, isOpen: cityModalIsOpen } = UseCityModal();

    const classes = useStyle(defaultClasses, props.classes);

    const icon = navigationIsOpen || cityModalIsOpen ? <Icon src={CloseIcon} /> : <Icon src={HamburgerIcon} />;

    let handleIconClick = handleOpenNavigation;
    if (cityModalIsOpen) {
        handleIconClick = handleOpenCityModal;
    }

    return (
        !props.selectingCountry && (
            <button
                className={classes.root}
                aria-label={formatMessage({
                    id: 'navigationTrigger.ariaLabel',
                    defaultMessage: 'Toggle navigation panel'
                })}
                onClick={handleIconClick}
            >
                {icon}
            </button>
        )
    );
};

NavigationTrigger.propTypes = {
    children: node,
    classes: shape({
        root: string
    }),
    selectingCountry: PropTypes.bool
};

export default NavigationTrigger;
