import classnames from 'classnames';
import React from 'react';

import classes from './colorsSection.module.css';

const ColorsSection = () => {
    const colorsList = [
        {
            class: classes.red,
            text: '#FD3C1D'
        },
        {
            class: classes.red80,
            text: '80%'
        },
        {
            class: classes.red60,
            text: '60%'
        },
        {
            class: classes.red40,
            text: '40%'
        },
        {
            class: classes.red20,
            text: '20%'
        },
        {
            class: classes.green,
            text: '#023527'
        },
        {
            class: classes.green80,
            text: '80%'
        },
        {
            class: classes.green60,
            text: '60%'
        },
        {
            class: classes.green40,
            text: '40%'
        },
        {
            class: classes.green20,
            text: '20%'
        },
        {
            class: classes.gray,
            text: '#CAC3C3'
        },
        {
            class: classes.gray80,
            text: '80%'
        },
        {
            class: classes.gray60,
            text: '60%'
        },
        {
            class: classes.gray40,
            text: '40%'
        },
        {
            class: classes.gray20,
            text: '20%'
        },
        {
            class: classes.brown,
            text: '#996958'
        },
        {
            class: classes.brown80,
            text: '80%'
        },
        {
            class: classes.brown60,
            text: '60%'
        },
        {
            class: classes.brown40,
            text: '40%'
        },
        {
            class: classes.brown20,
            text: '20%'
        },
        {
            class: classes.purple,
            text: '#331C2E'
        },
        {
            class: classes.purple80,
            text: '80%'
        },
        {
            class: classes.purple60,
            text: '60%'
        },
        {
            class: classes.purple40,
            text: '40%'
        },
        {
            class: classes.purple20,
            text: '20%'
        }
    ];

    return (
        <>
            <div className={classes.list}>
                {colorsList.map((color, index) => (
                    <div className={classes.item} key={index}>
                        <div className={classnames(classes.colorBadge, color.class)}>
                            <span className={classes.colorText}>{color.text}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ColorsSection;
