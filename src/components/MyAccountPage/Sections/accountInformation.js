import { Form } from 'informed';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '@app/components/overrides/Button';
import { useAccountInformationPage } from '@magento/peregrine/lib/talons/AccountInformationPage/useAccountInformationPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import GET_CUSTOMER_INFORMATION from '@magento/venia-ui/lib/components/AccountInformationPage/accountInformationPage.gql';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import Link from '@magento/venia-ui/lib/components/Link';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './accountInformation.module.css';
import sectionClasses from './myAccountSection.module.css';
import { useNewsletter } from './useNewsletter';

const AccountInformation = () => {
    const classes = useStyle(sectionClasses, defaultClasses);
    const { initialValues: customerData } = useAccountInformationPage(GET_CUSTOMER_INFORMATION);

    const { handleSubmit, isBusy } = useNewsletter();

    const accountInformationCard = customerData ? (
        <div className={classes.card}>
            <span className={classes.cardTitle}>
                <FormattedMessage id={'accountInformationPage.pageTitleText'} defaultMessage={'Contact Information'} />
            </span>
            <dl className={classes.cardBody}>
                <dd>
                    {customerData.customer.firstname} {customerData.customer.lastname}
                </dd>
                <dd className={classes.email}>{customerData.customer.email}</dd>
            </dl>
            <div className={classes.action}>
                <Link className={classes.link} to={'/account-information'}>
                    <FormattedMessage id={'global.edit'} defaultMessage={'Edit'} />
                </Link>
                <Link className={classes.link} to={'/account-information/change-password'}>
                    <FormattedMessage
                        id={'accountInformation.changePasswordLinkText'}
                        defaultMessage={'Change Password'}
                    />
                </Link>
            </div>
        </div>
    ) : (
        <Shimmer width="100%" height="296px" />
    );

    return (
        <div className={classes.root}>
            <div className={classes.heading}>
                <h4 className={classes.title}>
                    <FormattedMessage
                        id={'accountInformationPage.pageTitleText'}
                        defaultMessage={'Account Information'}
                    />
                </h4>
            </div>
            <div className={classes.content}>
                {accountInformationCard}
                <div className={classes.joinMailingCard}>
                    <CmsBlock
                        identifiers={'join_mailing'}
                        classes={{
                            root: null,
                            block: null,
                            content: null
                        }}
                    />
                    <Form onSubmit={handleSubmit}>
                        <Checkbox
                            classes={{ root: classes.checkbox }}
                            label=""
                            field="isSubscribed"
                            initialValue={true}
                        />
                        <Button className={classes.subscribeButton} type="submit" disabled={isBusy}>
                            <FormattedMessage
                                id={'accountInformation.joinMailingLinkText'}
                                defaultMessage={'JOIN NOW'}
                            />
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default AccountInformation;
