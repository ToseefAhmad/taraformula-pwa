import { Form } from 'informed';
import { bool, func, shape, string } from 'prop-types';
import React, { lazy, Suspense, useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import classes from '@app/components/overrides/CheckoutPage/CreateAccount/createAccount.module.css';
import { useCreateAccount } from '@magento/peregrine/lib/talons/CreateAccount/useCreateAccount';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Password from '@magento/venia-ui/lib/components/Password';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { hasLengthAtLeast, isRequired, validatePassword } from '@magento/venia-ui/lib/util/formValidators';

const TermsAndConditions = lazy(() => import('@app/components/Dialog/termsAndConditions'));

/**
 * Renders create account component.
 *
 * @param propsInitialValues
 * @param onSubmit
 * @param onCancel
 * @param isShortForm
 * @param isCancelButtonHidden
 * @returns {JSX.Element}
 */
const CreateAccount = ({
    initialValues: propsInitialValues,
    onSubmit,
    onCancel,
    isShortForm,
    isCancelButtonHidden
}) => {
    const { formatMessage } = useIntl();

    const [button, setButton] = useState(!isShortForm);
    const [terms, setTerms] = useState(false);
    const { errors, handleCancel, handleSubmit, isDisabled, initialValues } = useCreateAccount({
        initialValues: propsInitialValues,
        onSubmit: onSubmit,
        onCancel: onCancel,
        lastOrderAssign: true
    });
    const cancelButton = !isCancelButtonHidden && (
        <Button
            className={classes.cancelButton}
            disabled={isDisabled}
            type="button"
            priority="low"
            onClick={handleCancel}
        >
            <FormattedMessage id={'createAccount.cancelText'} defaultMessage={'Cancel'} />
        </Button>
    );

    const submitButton = (
        <Button
            className={isShortForm ? classes.submitButtonShortForm : classes.submitButton}
            disabled={isDisabled || !button}
            type="submit"
            priority="high"
        >
            <FormattedMessage id={'createAccountFromCheckout.createAccountText'} defaultMessage={'Submit'} />
        </Button>
    );

    const hideModal = useCallback(() => {
        setTerms(false);
    }, []);

    const termsBlock = (
        <Suspense fallback={null}>
            <TermsAndConditions onClose={hideModal} isOpen={terms} />
        </Suspense>
    );

    const termsText = (
        <p className={classes.termText}>
            <span>
                {formatMessage({
                    id: 'createAccount.subscribeTextTermsAndConditions',
                    defaultMessage: 'I accept the '
                })}
            </span>
            <b
                role="button"
                onClick={() => setTerms(true)}
                onKeyDown={() => setTerms(true)}
                className={classes.termsAndConditions}
                tabIndex={0}
            >
                {formatMessage({
                    id: 'global.termsAndConditions',
                    defaultMessage: 'Terms and conditions'
                })}
                *
            </b>
        </p>
    );

    const shortFormTitle = (
        <>
            <h4 className={classes.shortFormHeading}>
                <FormattedMessage
                    id={'createAccount.createAccountTextShortForm'}
                    defaultMessage={'Create an account for faster checkout'}
                />
            </h4>
            <p className={classes.shortFormHeadingDescription}>
                <FormattedMessage
                    id={'createAccount.createAccountTextShortFormDescription'}
                    defaultMessage={'Easily track and manage your order, address book and payment options.'}
                />
            </p>
        </>
    );

    const checkBox = !isShortForm ? (
        <>
            <Checkbox
                field="subscribe"
                id="subscribe"
                label={formatMessage({
                    id: 'createAccount.subscribeText',
                    defaultMessage: 'Subscribe to news and updates'
                })}
            />
        </>
    ) : (
        <div className={classes.checkBoxShortForm}>
            <Checkbox field="terms" id="terms" label="" onClick={() => setButton(!button)} />
            {termsText}
        </div>
    );
    return (
        <div>
            <FormError errors={Array.from(errors.values())} />
            <Form
                className={isShortForm ? classes.shortFormContainer : classes.root}
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {isShortForm ? (
                    shortFormTitle
                ) : (
                    <h2 className={classes.title}>
                        <FormattedMessage id={'createAccount.createAccountText'} defaultMessage={'Create an Account'} />
                    </h2>
                )}
                <div className={isShortForm ? classes.hiddenFormFields : ''}>
                    <Field
                        label={formatMessage({
                            id: 'createAccount.firstNameText',
                            defaultMessage: 'First Name'
                        })}
                    >
                        <TextInput
                            field="customer.firstname"
                            autoComplete="given-name"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <Field
                        label={formatMessage({
                            id: 'createAccount.lastNameText',
                            defaultMessage: 'Last Name'
                        })}
                    >
                        <TextInput
                            field="customer.lastname"
                            autoComplete="family-name"
                            validate={isRequired}
                            validateOnBlur
                        />
                    </Field>
                    <Field
                        label={formatMessage({
                            id: 'createAccount.emailText',
                            defaultMessage: 'Email'
                        })}
                    >
                        <TextInput field="customer.email" autoComplete="email" validate={isRequired} validateOnBlur />
                    </Field>
                </div>
                <div className={classes.passwordBlock}>
                    <Password
                        autoComplete="new-password"
                        fieldName="password"
                        isToggleButtonHidden={false}
                        label={formatMessage({
                            id: 'createAccountFromCheckout.passwordText',
                            defaultMessage: 'Create account password'
                        })}
                        validate={combine([isRequired, [hasLengthAtLeast, 8], validatePassword])}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                    />
                </div>
                <div className={classes.subscribe}>{checkBox}</div>
                <div className={classes.actions}>
                    {submitButton}
                    {cancelButton}
                </div>
            </Form>
            {termsBlock}
        </div>
    );
};

CreateAccount.propTypes = {
    classes: shape({
        actions: string,
        lead: string,
        root: string,
        subscribe: string,
        checkBoxShortForm: string,
        shortFormHeadingDescription: string,
        cancelButton: string,
        submitButtonShortForm: string,
        submitButton: string,
        shortFormHeading: string,
        shortFormContainer: string,
        title: string,
        hiddenFormFields: string,
        passwordBlock: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    }),
    isCancelButtonHidden: bool,
    onSubmit: func,
    onCancel: func,
    isShortForm: bool
};

CreateAccount.defaultProps = {
    onCancel: () => {},
    onSubmit: () => {},
    initialValues: {},
    isShortForm: true,
    isCancelButtonHidden: true
};

export default CreateAccount;
