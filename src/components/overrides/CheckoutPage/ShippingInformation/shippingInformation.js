import { func, string, shape } from 'prop-types';
import React, { Fragment, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';

import Card from '@app/components/overrides/CheckoutPage/ShippingInformation/card';
import { useStyle } from '@magento/venia-ui/lib/classify';
import AddressForm from '@magento/venia-ui/lib/components/CheckoutPage/ShippingInformation/AddressForm';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './shippingInformation.module.css';
import { useShippingInformation } from './useShippingInformation';

const EditModal = React.lazy(() =>
    import('@magento/venia-ui/lib/components/CheckoutPage/ShippingInformation/editModal')
);

const ShippingInformation = props => {
    const { classes: propClasses, onSave, onSuccess, toggleActiveContent } = props;
    const talonProps = useShippingInformation({
        onSave,
        toggleActiveContent
    });
    const { doneEditing, handleEditShipping, hasUpdate, isSignedIn, isLoading, shippingData } = talonProps;

    const classes = useStyle(defaultClasses, propClasses);

    const rootClassName = !doneEditing ? classes.root_editMode : hasUpdate ? classes.root_updated : classes.root;

    if (isLoading) {
        return (
            <Fragment>
                <h4 className={classes.editTitle}>
                    <FormattedMessage id={'shippingInformation.editTitle'} defaultMessage={'1. Shipping Information'} />
                </h4>
                <LoadingIndicator classes={{ root: classes.loading }}>
                    <FormattedMessage
                        id={'shippingInformation.loading'}
                        defaultMessage={'Fetching Shipping Information...'}
                    />
                </LoadingIndicator>
            </Fragment>
        );
    }

    const editModal = !isSignedIn ? (
        <Suspense fallback={null}>
            <EditModal onSuccess={onSuccess} shippingData={shippingData} />
        </Suspense>
    ) : null;

    const shippingInformation = doneEditing ? (
        <Fragment>
            <div className={classes.cardHeader}>
                <h4 className={classes.cardTitle}>
                    <FormattedMessage id={'shippingInformation.cardTitle'} defaultMessage={'Shipping Information'} />
                </h4>
                <LinkButton onClick={handleEditShipping} className={classes.editButton}>
                    <span className={classes.editText}>
                        <FormattedMessage id={'global.editButton'} defaultMessage={'Edit'} />
                    </span>
                </LinkButton>
            </div>
            <Card shippingData={shippingData} />
            {editModal}
        </Fragment>
    ) : (
        <Fragment>
            <h4 className={classes.editTitle}>
                <FormattedMessage id={'shippingInformation.editTitle'} defaultMessage={'1. Shipping Information'} />
            </h4>
            <div className={classes.editWrapper}>
                <AddressForm onSuccess={onSuccess} shippingData={shippingData} />
            </div>
        </Fragment>
    );

    return <div className={rootClassName}>{shippingInformation}</div>;
};

export default ShippingInformation;

ShippingInformation.propTypes = {
    classes: shape({
        root: string,
        root_editMode: string,
        cardHeader: string,
        cartTitle: string,
        editWrapper: string,
        editTitle: string,
        editButton: string,
        editIcon: string,
        editText: string
    }),
    onSave: func.isRequired,
    onSuccess: func.isRequired,
    toggleActiveContent: func.isRequired
};
