import { string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Image from '@magento/venia-ui/lib/components/Image';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import classes from './faq.module.css';

/**
 * @param image
 * @param data
 * @returns {JSX.Element|null}
 * @constructor
 */
const ProductFAQ = ({ image, data }) => {
    if (!data) {
        return null;
    }

    const imageContent = image && image !== 'no_selection' && (
        <Image
            key={'faq_image'}
            alt={'FAQ'}
            resource={image}
            classes={{
                image: classes.faqImage,
                root: classes.imageContainer
            }}
        />
    );

    return (
        <section className={classes.wrapper}>
            {image && image !== 'no_selection' && <div className={classes.imageSide}>{imageContent}</div>}
            <div className={classes.rightSide}>
                <h2 className={classes.header}>
                    <FormattedMessage id={'productFullDetail.FAQHeading'} defaultMessage={'FAQ'} />
                </h2>
                <RichContent
                    classes={{
                        root: classes.accordion
                    }}
                    html={data}
                />
            </div>
        </section>
    );
};
ProductFAQ.propTypes = {
    data: string,
    image: string
};
export default ProductFAQ;
