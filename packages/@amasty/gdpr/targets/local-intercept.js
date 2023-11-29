module.exports = targets => {
  targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
    flags[targets.name] = {
      cssModules: true,
      esModules: true,
      graphqlQueries: true
    };
  });

  const venia = targets.of('@magento/venia-ui');
  const peregrineTargets = targets.of('@magento/peregrine');
  const routes = venia.routes;

  routes.tap(route => {
    route.push({
      name: 'MyGreetingRoute',
      pattern: '/privacy-settings',
      path: targets.name + '/src/components/AccountPrivacySettings'
    });
    return route;
  });

  const talonsTarget = peregrineTargets.talons;

  talonsTarget.tap(({ AccountMenu }) => {
    AccountMenu.useAccountMenuItems.wrapWith(
      targets.name + '/targets/wrapUseAccountMenuItems'
    );
  });
};
