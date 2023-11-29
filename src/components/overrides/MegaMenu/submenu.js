import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { useSubMenu } from '@magento/peregrine/lib/talons/MegaMenu/useSubMenu';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CmsBlockGroup from '@magento/venia-ui/lib/components/CmsBlock';

import defaultClasses from './submenu.module.css';

/**
 * The Submenu component displays submenu in mega menu
 *
 * @param {array} props.items - categories to display
 * @param {int} props.mainNavWidth - width of the main nav. It's used for setting min-width of the submenu
 * @param {function} props.onNavigate - function called when clicking on Link
 */
const Submenu = props => {
    const { isFocused, subMenuState, handleCloseSubMenu, onNavigate, blockIdentifier, categoryUrlPath } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useSubMenu({
        isFocused,
        subMenuState,
        handleCloseSubMenu
    });

    const { isSubMenuActive } = talonProps;

    const subMenuClassname = isSubMenuActive ? classes.submenu_active : classes.submenu;

    const block = blockIdentifier ? (
        <div className={classes.submenuBlock}>
            <CmsBlockGroup
                identifiers={blockIdentifier}
                classes={{
                    root: null,
                    block: null,
                    content: null
                }}
            />
        </div>
    ) : null;

    return (
        <div className={subMenuClassname}>
            <div className={classes.subMenuContainer}>
                {block}
                <div className={classes.submenuActions}>
                    <Link className={classes.submenuActionsLink} to={'/' + categoryUrlPath} onClick={onNavigate}>
                        <span>
                            <FormattedMessage id={'submenu.parentCategoryLink'} defaultMessage={'Shop All'} />
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Submenu;

Submenu.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string),
    items: PropTypes.arrayOf(
        PropTypes.shape({
            children: PropTypes.array.isRequired,
            id: PropTypes.number.isRequired,
            include_in_menu: PropTypes.number.isRequired,
            isActive: PropTypes.bool.isRequired,
            name: PropTypes.string.isRequired,
            path: PropTypes.array.isRequired,
            position: PropTypes.number.isRequired,
            url_path: PropTypes.string.isRequired
        })
    ),
    mainNavWidth: PropTypes.number,
    categoryUrlPath: PropTypes.string.isRequired,
    categoryUrlSuffix: PropTypes.string,
    onNavigate: PropTypes.func.isRequired,
    isFocused: PropTypes.bool,
    subMenuState: PropTypes.bool,
    handleCloseSubMenu: PropTypes.func,
    blockIdentifier: PropTypes.string
};
