module.exports = targets => {
    targets.of('@magento/venia-ui').rootShimmerTypes.tap(rootShimmerTypes => {
        rootShimmerTypes.add({
            shimmerType: 'CATEGORY_PAGE_SHIMMER',
            importPath: 'src/RootComponents/Category/categoryContent.shimmer'
        });
    });
};
