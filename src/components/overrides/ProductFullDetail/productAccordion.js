import { arrayOf, shape, string } from 'prop-types';
import React, { Fragment, Suspense } from 'react';

import { Accordion, Section } from '@app/components/overrides/Accordion';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';

import classes from './productAccordion.module.css';

const ProductAccordion = ({ data }) => {
    const content = data.map(
        (item, index) =>
            item.content && (
                // Set first accordion state as open
                <Section
                    key={'title-' + index}
                    classes={{
                        root: classes.productSection
                    }}
                    id={'title-' + index}
                    title={item.title}
                    isOpen={index === 0}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        <RichContent html={item.content} />
                    </Suspense>
                </Section>
            )
    );

    return (
        <Fragment>
            <Accordion canOpenMultiple={false}>{content}</Accordion>
        </Fragment>
    );
};
ProductAccordion.propTypes = {
    data: arrayOf(
        shape({
            content: string,
            title: string
        })
    ),
    classes: shape({
        productSection: string
    })
};

export default ProductAccordion;
