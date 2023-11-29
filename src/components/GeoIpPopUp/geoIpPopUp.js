import { Form } from 'informed';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import classes from '@app/components/GeoIpPopUp/geoIpPopUp.module.css';
import { useGeoIpPopUp } from '@app/components/GeoIpPopUp/useGeoIpPopUp';
import { Close } from '@app/components/Icons';
import Button from '@magento/venia-ui/lib/components/Button';
import { Portal } from '@magento/venia-ui/lib/components/Portal';

import DropDowns from './dropdowns';

const GeoIpPopUp = () => {
    const {
        isHidden,
        handleClosePopUp,
        handleSubmit,
        handleLanguageSwitch,
        handleStoreSwitch,
        stores,
        availableLanguages,
        selectedLanguage,
        selectedCountry,
        dropDownClick,
        openDropDown
    } = useGeoIpPopUp();

    const { formatMessage } = useIntl();

    // Don't load content if it should be hidden or there are no stores
    if (isHidden || stores.length < 1) return null;

    return (
        <Portal>
            <Form className={!isHidden ? classes.root : classes.hidden} onSubmit={handleSubmit}>
                <div className={classes.popUp}>
                    <div className={classes.contentWrapper}>
                        <div className={classes.iconDiv}>
                            <Close onClick={handleClosePopUp} />
                        </div>

                        <h2 className={classes.header}>
                            <FormattedMessage id={'geoIpPopUp.title'} defaultMessage={'Welcome to Tara'} />
                        </h2>
                        <div className={classes.description}>
                            <FormattedMessage
                                id={'geoIpPopUp.description'}
                                defaultMessage={
                                    'In order to best tailor your shopping experience, please select your location and language preferences.'
                                }
                            />
                        </div>
                        <DropDowns
                            items={stores}
                            selectedValue={selectedCountry}
                            dropDownClick={dropDownClick}
                            openDropDown={openDropDown}
                            name="country"
                            label={formatMessage({
                                id: 'geoIpPopUp.chooseCountry',
                                defaultMessage: 'Choose your country'
                            })}
                            handleSwitch={handleStoreSwitch}
                            enabled={true}
                        />
                        <DropDowns
                            items={availableLanguages}
                            selectedValue={selectedLanguage}
                            dropDownClick={dropDownClick}
                            openDropDown={openDropDown}
                            name="language"
                            label={formatMessage({
                                id: 'geoIpPopUp.chooseLanguage',
                                defaultMessage: 'Choose your language'
                            })}
                            handleSwitch={handleLanguageSwitch}
                            enabled={selectedCountry}
                        />
                        <div className={classes.continueButton}>
                            <Button
                                priority="primary"
                                fill="solid"
                                type="submit"
                                disabled={!selectedLanguage || !selectedCountry}
                            >
                                <FormattedMessage id="geoIpPopUp.continue" defaultMessage="Continue" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
        </Portal>
    );
};

export default GeoIpPopUp;
