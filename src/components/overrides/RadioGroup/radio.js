import { Radio as InformedRadio } from 'informed';
import { node, shape, string } from 'prop-types';
import React, { useState } from 'react';
import { Circle } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './radio.module.css';

const RadioOption = props => {
    const { classes: propClasses, id, label, image, value, ...rest } = props;
    const classes = useStyle(defaultClasses, propClasses);
    const [imageLoaded, setImageLoaded] = useState(false);

    const shimmerImage = image && !imageLoaded ? classes.shimmer : null;

    return (
        <label className={classes.root} htmlFor={id}>
            <InformedRadio {...rest} className={classes.input} id={id} value={value} />
            <span className={classes.icon}>
                <Circle size="16" />
            </span>
            {image && (
                <div className={classes.image}>
                    <img className={shimmerImage} onLoad={() => setImageLoaded(true)} alt={label} src={image} />
                </div>
            )}
            <span className={classes.label}>{label || (value != null ? value : '')}</span>
        </label>
    );
};

export default RadioOption;

RadioOption.propTypes = {
    classes: shape({
        icon: string,
        input: string,
        label: string,
        root: string
    }),
    id: string.isRequired,
    label: node.isRequired,
    value: node.isRequired,
    image: string
};

/* eslint-enable jsx-a11y/label-has-for */
