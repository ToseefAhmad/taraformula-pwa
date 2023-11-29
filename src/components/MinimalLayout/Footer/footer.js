import { shape, string } from 'prop-types';
import React from 'react';

import { useFooter } from '@magento/peregrine/lib/talons/Footer/useFooter';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './footer.module.css';

const Footer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useFooter();

    const { copyrightText } = talonProps;

    return (
        <footer className={classes.root}>
            <p className={classes.copyright}>{copyrightText || null}</p>
        </footer>
    );
};

export default Footer;

Footer.propTypes = {
    classes: shape({
        root: string
    })
};
