import { bool, func, string } from 'prop-types';
import React, { useCallback } from 'react';
import { useIntl } from 'react-intl';

import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import Dialog from '@magento/venia-ui/lib/components/Dialog/index.js';

const CMS_BLOCK_ID_TERMS_AND_CONDITIONS = 'terms_and_conditions';

/**
 * Renders terms and conditions dialog.
 *
 * @param props
 * @returns {JSX.Element}
 */
const TermsAndConditions = ({ isOpen, onClose, showButtons, cmsBlockId }) => {
    const { formatMessage } = useIntl();
    const handleClose = useCallback(() => onClose(), [onClose]);

    return (
        <Dialog
            confirmText="Ok"
            confirmTranslationId="global.confirm"
            isOpen={isOpen}
            onCancel={handleClose}
            shouldShowButtons={showButtons}
            title={formatMessage({
                id: 'global.termsAndConditions',
                defaultMessage: 'Terms and Conditions'
            })}
        >
            <CmsBlock identifiers={cmsBlockId} />
        </Dialog>
    );
};

TermsAndConditions.propTypes = {
    cmsBlockId: string,
    isOpen: bool,
    onClose: func,
    showButtons: bool
};

TermsAndConditions.defaultProps = {
    cmsBlockId: CMS_BLOCK_ID_TERMS_AND_CONDITIONS,
    isOpen: false,
    onClose: () => {},
    showButtons: false
};

export default TermsAndConditions;
