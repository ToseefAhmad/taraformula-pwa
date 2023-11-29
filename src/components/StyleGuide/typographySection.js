import React from 'react';

import classes from './typographySection.module.css';

const TypographySection = () => {
    return (
        <div className={classes.root}>
            <div className={classes.columns}>
                <div className={classes.column}>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Heading / Desktop</span>
                        <div className={classes.headingWrapper}>
                            <h1 className={classes.heading}>Heading 1</h1>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h2 className={classes.heading}>Heading 2</h2>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h3 className={classes.heading}>Heading 3</h3>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h4 className={classes.heading}>Heading 4</h4>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h5 className={classes.heading}>Heading 5</h5>
                        </div>
                    </section>
                </div>
                <div className={classes.column}>
                    <section className={classes.section}>
                        <span className={classes.subtitle}>Heading / Mobile</span>
                        <div className={classes.headingWrapper}>
                            <h1 className={classes.headingMobile1}>Heading 1</h1>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h2 className={classes.headingMobile2}>Heading 2</h2>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h3 className={classes.headingMobile3}>Heading 3</h3>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h4 className={classes.headingMobile4}>Heading 4</h4>
                        </div>
                        <div className={classes.headingWrapper}>
                            <h5 className={classes.headingMobile5}>Heading 5</h5>
                        </div>
                    </section>
                </div>
            </div>
            <section className={classes.section}>
                <span className={classes.subtitle}>Caption</span>
                <div className={classes.captionWrapper}>
                    <span className={classes.captionBold}>Caption 1 Arsenal 18pt Bold</span>
                    <span className={classes.caption}>Caption 1 Arsenal 18pt</span>
                </div>
                <div className={classes.captionWrapper}>
                    <span className={classes.caption2Bold}>Caption 2 Arsenal 15pt Bold</span>
                    <span className={classes.caption2}>Caption 2 Arsenal 15pt</span>
                </div>
            </section>
            <section className={classes.section}>
                <span className={classes.subtitle}>Category Tag</span>
                <span className={classes.categoryTag}>Category Tag Arsenal 12pt Bold All Caps</span>
            </section>
            <section className={classes.section}>
                <span className={classes.subtitle}>Body</span>
                <div className={classes.subSection}>
                    <p className={classes.bodyText}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                        the industry&apos;s standard dummy text ever since the 1500s.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default TypographySection;
