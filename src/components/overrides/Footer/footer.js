import { shape, string } from 'prop-types';
import React from 'react';

import { useFooter } from '@magento/peregrine/lib/talons/Footer/useFooter';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CmsBlockGroup from '@magento/venia-ui/lib/components/CmsBlock';
import Newsletter from '@magento/venia-ui/lib/components/Newsletter';

import defaultClasses from './footer.module.css';

const CMS_BLOCK_ID_FOOTER_YOTPO = 'footer_yotpo';

const Footer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useFooter();

    const { copyrightText } = talonProps;

    return (
        <footer className={classes.root}>
            <CmsBlockGroup
                identifiers={CMS_BLOCK_ID_FOOTER_YOTPO}
                classes={{
                    root: classes.yotpo,
                    block: null,
                    content: null
                }}
            />

            <div className={classes.footerContainer}>
                <div className={classes.footerColumnLeft}>
                    <CmsBlockGroup
                        identifiers={'footer_about_us'}
                        classes={{
                            root: classes.aboutUs,
                            block: null,
                            content: null
                        }}
                    />

                    <div className={classes.newsletterWrapperMobile}>
                        <Newsletter />
                    </div>

                    <div className={classes.linksContainer}>
                        <CmsBlockGroup
                            identifiers={'footer_links_1'}
                            classes={{
                                root: classes.linksColumn,
                                block: null,
                                content: classes.linksColumnContent
                            }}
                        />
                        <CmsBlockGroup
                            identifiers={'footer_links_2'}
                            classes={{
                                root: classes.socialIcons,
                                block: null,
                                content: classes.linksColumnContent
                            }}
                        />
                        <CmsBlockGroup
                            identifiers={'footer_links_3'}
                            classes={{
                                root: classes.linksColumn,
                                block: null,
                                content: classes.linksColumnContent
                            }}
                        />
                    </div>
                </div>

                <div className={classes.footerColumnRight}>
                    <div className={classes.newsletterWrapperDesktop}>
                        <Newsletter />
                    </div>
                </div>
            </div>

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
