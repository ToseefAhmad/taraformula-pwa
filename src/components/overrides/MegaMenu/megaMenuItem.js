import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useMegaMenuItem } from '@magento/peregrine/lib/talons/MegaMenu/useMegaMenuItem';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import classes from './megaMenuItem.module.css';
import Submenu from './submenu';

/**
 * The MegaMenuItem component displays mega menu item
 */
const MegaMenuItem = ({ category, activeCategoryId, categoryUrlSuffix, onNavigate, subMenuState, disableFocus }) => {
    const categoryUrl = resourceUrl(`/${category.url_path}${categoryUrlSuffix || ''}`);

    // The category.add_submenu_cms_block comes in format: "identifier|id"
    // But we need only "identifier" without "|id"
    const submenuCsmBlockIdentifier = category.add_submenu_cms_block
        ? /[^|]*/.exec(category.add_submenu_cms_block)[0]
        : null;

    const { isFocused, isActive, handleCloseSubMenu, isMenuActive, handleKeyDown } = useMegaMenuItem({
        category,
        activeCategoryId,
        subMenuState,
        disableFocus
    });

    const megaMenuItemClassname = isMenuActive ? classes.megaMenuItem_active : classes.megaMenuItem;

    const submenu = useMemo(() => {
        return submenuCsmBlockIdentifier ? (
            <Submenu
                isFocused={isFocused}
                subMenuState={subMenuState}
                handleCloseSubMenu={handleCloseSubMenu}
                blockIdentifier={submenuCsmBlockIdentifier}
                categoryUrlPath={category.url_path}
                onNavigate={onNavigate}
            />
        ) : null;
    }, [category.url_path, submenuCsmBlockIdentifier, isFocused, subMenuState, handleCloseSubMenu, onNavigate]);

    const linkAttributes = category.children.length
        ? {
              'aria-label': `Category: ${category.name}. ${category.children.length} sub-categories`
          }
        : {};

    return (
        <div className={megaMenuItemClassname}>
            <Link
                {...linkAttributes}
                onKeyDown={handleKeyDown}
                className={isActive ? classes.megaMenuLinkActive : classes.megaMenuLink}
                to={categoryUrl}
                onClick={onNavigate}
                title={category.name}
            >
                {category.name}
            </Link>
            {submenu}
        </div>
    );
};

export default MegaMenuItem;

MegaMenuItem.propTypes = {
    category: PropTypes.shape({
        children: PropTypes.array,
        id: PropTypes.number.isRequired,
        include_in_menu: PropTypes.number,
        isActive: PropTypes.bool.isRequired,
        name: PropTypes.string.isRequired,
        path: PropTypes.array.isRequired,
        position: PropTypes.number.isRequired,
        url_path: PropTypes.string.isRequired,
        add_submenu_cms_block: PropTypes.string
    }).isRequired,
    activeCategoryId: PropTypes.number,
    categoryUrlSuffix: PropTypes.string,
    onNavigate: PropTypes.func.isRequired,
    subMenuState: PropTypes.bool,
    disableFocus: PropTypes.bool
};
