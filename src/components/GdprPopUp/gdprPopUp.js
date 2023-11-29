import { Form } from 'informed';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import TermsAndConditions from '@app/components/TermsAndConditions';
import useTracking from '@app/hooks/useTracking/useTracking';
import { useEventListener } from '@magento/peregrine/lib/hooks/useEventListener';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox/checkbox';
import Dialog from '@magento/venia-ui/lib/components/Dialog/index.js';
import { Portal } from '@magento/venia-ui/lib/components/Portal';

import classes from './gdprPopUp.module.css';
import { useGdprPopUp } from './useGdprPopUp';

const GdprPopUp = () => {
    const {
        handleSubmit,
        isHidden,
        notificationText,
        handleAllSubmit,
        groups,
        initialValues,
        handleGroupStatus
    } = useGdprPopUp();
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [isManagingCookies, setIsManagingCookies] = useState(false);
    const { trackCookieConsent } = useTracking();

    useEventListener(globalThis.document, 'mousedown', event => {
        if (event.target.id === 'agreementBtn') {
            setIsOpenDialog(true);
        }
    });

    const handleCheckboxClick = groupId => {
        return evt => {
            handleGroupStatus(evt.target.checked, groupId);
        };
    };

    if (!groups.length) {
        // Need to make sure data is completely loaded before we set initial values
        return null;
    }

    return (
        <Portal>
            <Form
                initialValues={initialValues}
                onSubmit={handleSubmit}
                className={!isHidden ? classes.root : classes.hidden}
            >
                <div className={classes.popup}>
                    <div>
                        <h2 className={isManagingCookies ? classes.manageHeader : classes.header}>
                            <FormattedMessage id={'cookiesPopup.title'} defaultMessage={'Cookies Settings'} />
                        </h2>
                        <p className={classes.message} dangerouslySetInnerHTML={{ __html: notificationText }} />
                        {isManagingCookies && (
                            <div className={classes.checkboxRow}>
                                {groups.map(group => {
                                    return (
                                        <div className={classes.checkbox} key={group.id}>
                                            <Checkbox
                                                isCircle={true}
                                                disabled={group.is_essential}
                                                label={group.name}
                                                field={group.id.toString()}
                                                onClick={handleCheckboxClick(group.id)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className={!isManagingCookies ? classes.manageCookies : classes.addCookies}>
                        {!isManagingCookies && (
                            <Button
                                type="button"
                                priority="primary"
                                fill="transparent"
                                onClick={() => {
                                    trackCookieConsent({ type: 'managing' });
                                    setIsManagingCookies(true);
                                }}
                            >
                                <FormattedMessage id="gdpr.manageCookies" defaultMessage="Manage Cookies" />
                            </Button>
                        )}

                        {isManagingCookies && (
                            <Button priority="primary" fill="transparent" type="submit">
                                <FormattedMessage id="gdpr.save" defaultMessage="Submit" />
                            </Button>
                        )}

                        <Button
                            priority="primary"
                            fill="solid"
                            onClick={() => {
                                trackCookieConsent({ type: isManagingCookies ? 'manageAllowAll' : 'initialAllowAll' });
                                handleAllSubmit();
                            }}
                        >
                            <FormattedMessage id="gdpr.cookiesAccept" defaultMessage="Accept" />
                        </Button>
                    </div>
                    <Dialog handleClose={() => setIsOpenDialog(false)} isOpen={isOpenDialog}>
                        <TermsAndConditions />
                    </Dialog>
                </div>
            </Form>
        </Portal>
    );
};

export default GdprPopUp;
