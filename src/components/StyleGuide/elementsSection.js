import React from 'react';
import { Link } from 'react-router-dom';

import { Accordion, Section } from '@app/components/overrides/Accordion';

import classes from './elementsSection.module.css';

const ElementsSection = () => {
    return (
        <div className={classes.root}>
            <section className={classes.section}>
                <span className={classes.subtitle}>Links</span>
                <Link className={classes.link} to="#">
                    Text Link
                </Link>
            </section>
            <section className={classes.section}>
                <span className={classes.subtitle}>Label / Desktop</span>
                <span className={classes.label}>Heritage</span>
            </section>
            <section className={classes.section}>
                <span className={classes.subtitle}>Label / Mobile</span>
                <span className={classes.labelMobile}>Heritage</span>
            </section>
            <section className={classes.section}>
                <span className={classes.subtitle}>Tabs</span>
                <h4 className={classes.accordionTitle}>Shipping and Returns</h4>
                <Accordion canOpenMultiple={true}>
                    <Section id={'1'} title="When will my order be shipped?">
                        All orders will be shipped within 3 business days of being ordered. You will receive tracking
                        details of your order once it has shipped.
                    </Section>
                    <Section id={'2'} title="What are the available delivery options?">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et.
                    </Section>
                </Accordion>
            </section>
        </div>
    );
};

export default ElementsSection;
