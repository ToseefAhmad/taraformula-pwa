import { Form } from 'informed';
import { func } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AmSocialLogin from '@app/components/SocialLogin';
import { useLocale } from '@app/hooks/useLocale/useLocale';
import { isLanguageRtl } from '@app/util/isLanguageRtl';
import { useSignIn } from '@magento/peregrine/lib/talons/SignIn/useSignIn';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { GET_CART_DETAILS_QUERY } from '@magento/venia-ui/lib/components/SignIn/signIn.gql';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './signIn.module.css';

const SignIn = ({ setDefaultUsername, showCreateAccount, showForgotPassword }) => {
    const { formatMessage } = useIntl();
    const { currentStoreLocale } = useLocale();
    const { handleCreateAccount, handleForgotPassword, handleSubmit, isBusy, setFormApi } = useSignIn({
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword
    });

    if (isBusy) {
        return (
            <div className={classes.modalActive}>
                <LoadingIndicator>
                    {!isLanguageRtl(currentStoreLocale) && (
                        <FormattedMessage id={'signIn.loadingText'} defaultMessage={'Signing In'} />
                    )}
                </LoadingIndicator>
            </div>
        );
    }

    const forgotPasswordClasses = {
        root: classes.forgotPasswordButton
    };

    const checkboxClasses = {
        checkbox_active: classes.checkboxActive,
        checkbox_inactive: classes.checkboxInactive,
        input: classes.checkboxInput,
        label: classes.checkboxLabel
    };

    const textInputClasses = {
        input: classes.input,
        label: classes.inputLabel,
        input_error: classes.inputError
    };

    return (
        <div className={classes.root}>
            <h3 className={classes.title}>
                <FormattedMessage id={'signIn.titleText'} defaultMessage={'Sign in to your account'} />
            </h3>
            <AmSocialLogin mode={'popup'} page={'signIn'} />
            <Form getApi={setFormApi} className={classes.form} onSubmit={handleSubmit}>
                <Field>
                    <TextInput
                        classes={textInputClasses}
                        autoComplete="email"
                        field="email"
                        validate={isRequired}
                        label={formatMessage({
                            id: 'signIn.emailAddressText',
                            defaultMessage: 'Username or Email Address'
                        })}
                        optional={false}
                    />
                </Field>
                <Field>
                    <TextInput
                        classes={textInputClasses}
                        autoComplete="current-password"
                        field="password"
                        validate={isRequired}
                        type="password"
                        label={formatMessage({
                            id: 'signIn.passwordText',
                            defaultMessage: 'Password'
                        })}
                        optional={false}
                    />
                </Field>
                <div className={classes.optionsContainer}>
                    <Checkbox
                        classes={checkboxClasses}
                        label={formatMessage({
                            id: 'signIn.rememberMeText',
                            defaultMessage: 'Remember me'
                        })}
                        field="rememberMe"
                    />
                    <LinkButton classes={forgotPasswordClasses} type="button" onClick={handleForgotPassword}>
                        <FormattedMessage id={'signIn.forgotPasswordText'} defaultMessage={'Forgot Password?'} />
                    </LinkButton>
                </div>
                <div className={classes.buttonsContainer}>
                    <Button priority="primary" fill="solid" type="submit">
                        <FormattedMessage id={'signIn.signInText'} defaultMessage={'Log In'} />
                    </Button>
                    <div className={classes.registerDivider}>
                        <FormattedMessage
                            id={'signIn.dontHaveAnAccountText'}
                            defaultMessage={"Don't have an account?"}
                        />
                    </div>
                    <Button priority="primary" fill="outline" type="button" onClick={handleCreateAccount}>
                        <FormattedMessage id={'signIn.registerText'} defaultMessage={'Register'} />
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default SignIn;
SignIn.propTypes = {
    setDefaultUsername: func,
    showCreateAccount: func,
    showForgotPassword: func
};
SignIn.defaultProps = {
    setDefaultUsername: () => {},
    showCreateAccount: () => {},
    showForgotPassword: () => {}
};
