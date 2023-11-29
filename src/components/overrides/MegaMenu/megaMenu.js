import React, { Fragment, useRef } from 'react';

import { useOtherHeaderLinks } from '@app/components/MegaMenu/useOtherHeaderLinks';
import { useHeader } from '@app/components/overrides/Header/useHeader';
import { useMegaMenu } from '@app/overrides/peregrine/talons/MegaMenu/useMegaMenu';
import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';

import classes from './megaMenu.module.css';
import MegaMenuShimmer from './megaMenu.shimmer';
import MegaMenuItem from './megaMenuItem';

/**
 * The MegaMenu component displays menu with categories on desktop devices
 */
const MegaMenu = () => {
    const mainNavRef = useRef(null);
    const overflowRef = useRef(null);
    const { translationReady } = useHeader();

    const {
        megaMenuData,
        activeCategoryId,
        subMenuState,
        disableFocus,
        handleSubMenuFocus,
        categoryUrlSuffix,
        handleNavigate,
        isOverflowing
    } = useMegaMenu({ mainNavRef, overflowRef });
    const shouldRenderItems = useIsInViewport({
        elementRef: mainNavRef
    });

    const otherHeaderLinks = useOtherHeaderLinks();

    const items = megaMenuData.children ? (
        megaMenuData.children.map(category => {
            return (
                <MegaMenuItem
                    category={category}
                    activeCategoryId={activeCategoryId}
                    categoryUrlSuffix={categoryUrlSuffix}
                    onNavigate={handleNavigate}
                    key={category.id}
                    subMenuState={subMenuState}
                    disableFocus={disableFocus}
                />
            );
        })
    ) : (
        <Fragment>
            <MegaMenuShimmer />
            <MegaMenuShimmer />
            <MegaMenuShimmer />
            <MegaMenuShimmer />
            <MegaMenuShimmer />
        </Fragment>
    );

    const otherItems =
        megaMenuData.children && otherHeaderLinks.length > 0 && translationReady ? (
            otherHeaderLinks.map(category => {
                return (
                    category.id && (
                        <MegaMenuItem
                            category={category}
                            activeCategoryId={activeCategoryId}
                            categoryUrlSuffix={categoryUrlSuffix}
                            onNavigate={handleNavigate}
                            key={category.id}
                            subMenuState={subMenuState}
                            disableFocus={disableFocus}
                        />
                    )
                );
            })
        ) : (
            <Fragment>
                <MegaMenuShimmer />
                <MegaMenuShimmer />
                <MegaMenuShimmer />
            </Fragment>
        );

    return (
        <Fragment>
            <nav
                ref={mainNavRef}
                className={!isOverflowing ? classes.megaMenu : classes.megaMenuCompact}
                role="navigation"
                onFocus={handleSubMenuFocus}
            >
                {shouldRenderItems && items}
                {shouldRenderItems && otherItems}
            </nav>
            <div ref={overflowRef} className={classes.overflowElement}>
                {shouldRenderItems && items}
                {shouldRenderItems && otherItems}
            </div>
        </Fragment>
    );
};

export default MegaMenu;
