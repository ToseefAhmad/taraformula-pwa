import { object } from 'prop-types';
import React from 'react';

import Yotpo from '@app/components/Yotpo';

/**
 * Page Builder Yotpo Instagram component.
 *
 * @typedef YotpoInstagramBlock
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Yotpo instagram block
 */
const YotpoInstagramBlock = ({ yotpoConfig }) => {
    return <Yotpo yotpoConfig={yotpoConfig} />;
};

/**
 * Props for {@link YotpoInstagramBlock}
 *
 * @typedef props
 *
 * @property {Object} yotpoConfig # config for yotpo slider
 */
YotpoInstagramBlock.propTypes = {
    yotpoConfig: object
};

YotpoInstagramBlock.defaultProps = {
    yotpoConfig: {}
};

export default YotpoInstagramBlock;
