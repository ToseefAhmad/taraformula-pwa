export default node => {
    if (!node) {
        return {
            iubendaConfig: {}
        };
    }

    return {
        iubendaConfig: {
            url: node.getAttribute('data-url')
        }
    };
};
