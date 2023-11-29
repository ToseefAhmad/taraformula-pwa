import React from 'react';

import {
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    Box,
    Check,
    Close,
    Delivery,
    Facebook,
    Hamburger,
    Heart,
    Minus,
    NewsletterArrow,
    Plus,
    Star,
    Bag
} from '@app/components/Icons';

import classes from './iconsSection.module.css';

const IconsSection = () => {
    const icons = [
        {
            component: <ArrowDown />
        },
        {
            component: <ArrowLeft />
        },
        {
            component: <ArrowRight />
        },
        {
            component: <ArrowUp />
        },
        {
            component: <Box />
        },
        {
            component: <Check />
        },
        {
            component: <Close />
        },
        {
            component: <Delivery />
        },
        {
            component: <Facebook />
        },
        {
            component: <Hamburger />
        },
        {
            component: <Heart />
        },
        {
            component: <Minus />
        },
        {
            component: <NewsletterArrow />
        },
        {
            component: <Plus />
        },
        {
            component: <Star />
        },
        {
            component: <Bag />
        }
    ];

    return (
        <div className={classes.root}>
            <div className={classes.list}>
                {icons.map((icon, index) => (
                    <div className={classes.icon} key={index}>
                        {icon.component}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IconsSection;
