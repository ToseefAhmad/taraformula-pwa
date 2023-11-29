export default node => {
    if (!node) {
        return {
            yotpoConfig: {}
        };
    }

    return {
        yotpoConfig: {
            pageNumber: node.getAttribute('data-page-number'),
            pageSize: node.getAttribute('data-page-size'),
            album: node.getAttribute('data-album'),
            storeViewKey: node.getAttribute('data-store-view-key'),
            instagramUrl: node.getAttribute('data-instagram-url'),
            dateUntil: node.getAttribute('data-until'),
            dateSince: node.getAttribute('data-since'),
            centerMode: !!node.getAttribute('data-center-mode'),
            slidesToShow: +node.getAttribute('data-slides-amount'),
            slidesToShowSmall: +node.getAttribute('data-slides-amount-mobile'),
            arrows: !!node.getAttribute('data-arrows'),
            dots: !!node.getAttribute('data-dots')
        }
    };
};
