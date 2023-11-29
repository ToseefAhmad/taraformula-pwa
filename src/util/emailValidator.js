/**
 * @fileoverview This file houses functions that can be used for
 * validation of email fields.
 *
 * Note that these function should return a string error message
 * when they fail, and `undefined` when they pass.
 */

const SUCCESS = undefined;

export const isEmail = value => {
    /* eslint-disable */
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/gi;
    /* eslint-enable */

    const FAILURE = {
        id: 'validation.isEmail',
        defaultMessage: 'Email is incorrect.'
    };

    if (!value) return SUCCESS;

    const isThisCorrectEmail = emailPattern.test(value);

    if (!isThisCorrectEmail) return FAILURE;

    return SUCCESS;
};
