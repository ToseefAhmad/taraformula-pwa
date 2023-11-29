import moment from 'moment';
// Converting Date to format -> January 11, 2022

export const getCorrectDateFormat = date => {
    return moment(date)
        .format('LL')
        .toString();
};

export const getShortDateFormat = date => {
    return moment(date)
        .format('MMM D, YYYY')
        .toString();
};
