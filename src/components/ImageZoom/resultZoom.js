import { object, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './imageZoom.module.css';

const ResultZoom = ({ resultRef, ...props }) => {
    const classes = useStyle(defaultClasses, props.classes);

    return <div ref={resultRef} id="zoomResult" className={classes.zoomResult} />;
};

ResultZoom.propTypes = {
    resultRef: object.isRequired,
    classes: string
};

export default ResultZoom;
