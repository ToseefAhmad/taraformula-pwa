import { string } from 'prop-types';
import React from 'react';

import RichContent from '@magento/venia-ui/lib/components/RichContent';

/**
 * CMS Block component.
 *
 * @typedef Block
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a CMS Block.
 */
const Block = ({ content }) => <RichContent html={content} />;

/**
 * Props for {@link Block}
 *
 * @typedef props
 *
 * @property {String} content Rich content of the block
 */
Block.propTypes = {
    content: string
};

export default Block;
