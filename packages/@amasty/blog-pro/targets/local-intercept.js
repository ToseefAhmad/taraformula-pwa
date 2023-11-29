module.exports = targets => {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
        flags[targets.name] = {
            cssModules: true,
            esModules: true,
            graphqlQueries: true,
            rootComponents: true
        };
    });

    const venia = targets.of('@magento/venia-ui');

    const routes = venia.routes;

    routes.tap(routesArray => {
        routesArray.push({
            name: 'Blog',
            pattern: '/blog/:slug?/:id?',
            path: targets.name + '/src/RootComponents/Blog',
            exact: true
        });

        return routesArray;
    });
};
