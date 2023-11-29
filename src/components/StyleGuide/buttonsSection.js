import React from 'react';

import Button from '@magento/venia-ui/lib/components/Button';

import classes from './buttonsSection.module.css';

const ElementsSection = () => {
    return (
        <div className={classes.root}>
            <section className={classes.section}>
                <span className={classes.subtitle}>Primary Buttons</span>
                <div className={classes.list}>
                    <div className={classes.buttonWrapper}>
                        <Button priority="primary" fill="solid">
                            Primary Solid
                        </Button>
                    </div>
                    <div className={classes.buttonWrapper}>
                        <Button priority="primary" fill="outline">
                            Primary Outline
                        </Button>
                    </div>
                </div>
            </section>
            <section className={classes.section}>
                <span className={classes.subtitle}>Secondary Buttons</span>
                <div className={classes.list}>
                    <div className={classes.buttonWrapper}>
                        <Button priority="secondary" fill="solid">
                            Secondary Solid
                        </Button>
                    </div>
                    <div className={classes.buttonWrapper}>
                        <Button priority="secondary" fill="outline">
                            Secondary Outline
                        </Button>
                    </div>
                </div>
            </section>
            <section className={classes.section}>
                <span className={classes.subtitle}>Tertiary Buttons</span>
                <div className={classes.list}>
                    <div className={classes.buttonWrapper}>
                        <Button priority="tertiary" fill="solid">
                            Tertiary Solid
                        </Button>
                    </div>
                    <div className={classes.buttonWrapper}>
                        <Button priority="tertiary" fill="outline">
                            Tertiary Outline
                        </Button>
                    </div>
                </div>
            </section>
            <section className={classes.section}>
                <span className={classes.subtitle}>Disabled Button</span>
                <div className={classes.buttonWrapper}>
                    <Button disabled>Disabled</Button>
                </div>
            </section>
        </div>
    );
};

export default ElementsSection;
