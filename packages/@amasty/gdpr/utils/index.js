export const parseLink = strLinkHTML => {
    const div = document.createElement('div');
    const link = {};

    div.innerHTML = strLinkHTML;
    if (div.firstElementChild) {
        link.text = div.firstElementChild.innerText;
    }

    const text = div.innerText.split(link.text);
    link.prevText = text[0];
    link.afterText = text[1];

    return link;
};

export const getVisibleConsents = (
    consents,
    isAccountSettingsPage,
    location
) => {
    if (!isAccountSettingsPage) {
        if (!consents) {
            return [];
        }
        return consents.filter(consent => {
            return (
                consent.consent_location.includes(location) &&
                (!consent.hide_the_consent_after_user_left_the_consent ||
                    !consent.has_agreement)
            );
        });
    }

    return consents.filter(consent => {
        return consent.hide_the_consent_after_user_left_the_consent;
    });
};

export const getCheckedConsentArray = (
    checkedConsents,
    consentFrom,
    consentCode,
    isChecked
) => {
    if (!isChecked) {
        return (checkedConsents.current = checkedConsents.current.filter(item => {
            return consentCode === item.consent_code ? isChecked : true;
        }));
    }

    checkedConsents.current.push({
        consent_from: consentFrom,
        consent_code: consentCode,
        has_agreement: isChecked
    });
};
