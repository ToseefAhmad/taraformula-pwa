import { object } from 'prop-types';
import React from 'react';

import Iubenda from '@app/components/Iubenda';

/**
 * Page Builder Iubenda component.
 *
 * @typedef IubendaBlock
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Iubenda block
 */
const IubendaBlock = ({ iubendaConfig }) => {
    return <Iubenda iubendaConfig={iubendaConfig} />;
};

/**
 * Props for {@link IubendaBlock}
 *
 * @typedef props
 *
 * @property {Object} iubendaConfig # config for iubenda block
 */
IubendaBlock.propTypes = {
    iubendaConfig: object
};

IubendaBlock.defaultProps = {
    iubendaConfig: {}
};

export default IubendaBlock;
