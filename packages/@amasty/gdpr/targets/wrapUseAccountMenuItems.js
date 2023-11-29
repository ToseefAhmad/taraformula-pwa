const GDPR_ITEM = {
  name: 'Privacy Settings',
  id: 'amGdpr.gdprAccountTitle',
  url: '/privacy-settings'
};

const wrapUseAccountMenuItems = original => props => {
  const defaultReturnData = original(props);

  const { menuItems } = defaultReturnData;

  return {
    ...defaultReturnData,
    menuItems: [...menuItems, GDPR_ITEM]
  };
};

export default wrapUseAccountMenuItems;
