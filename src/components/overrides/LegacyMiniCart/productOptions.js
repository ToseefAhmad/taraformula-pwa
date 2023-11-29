import { arrayOf, shape, string } from 'prop-types';
import React, { useMemo } from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './productOptions.module.css';

const ProductOptions = props => {
    const { options } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const displayOptions = useMemo(
        () =>
            options.map(({ option_label, value_label }) => {
                const key = `${option_label}${value_label}`;
                const optionLabelString = `${option_label}: `;
                return (
                    <div key={key} className={classes.optionLabel}>
                        <dt className={classes.optionName}>{optionLabelString}</dt>
                        <dd className={classes.optionValue}>{value_label}</dd>
                    </div>
                );
            }),
        [classes, options]
    );

    return displayOptions.length ? <dl className={classes.options}>{displayOptions}</dl> : null;
};

ProductOptions.propTypes = {
    classes: shape({
        options: string,
        optionLabel: string,
        optionName: string,
        optionValue: string
    }),
    options: arrayOf(
        shape({
            label: string,
            value: string
        })
    )
};

ProductOptions.defaultValues = {
    options: []
};

export default ProductOptions;
