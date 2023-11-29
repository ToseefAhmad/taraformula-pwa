import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import PolicyButton from '../policyButton';
import { usePolicyButton } from '../../../talons/usePolicyButton';

jest.mock('../../../talons/usePolicyButton', () => {
  const usePolicyButton = jest.fn(() => {});

  return { usePolicyButton };
});
jest.mock('react-intl', () => ({
  FormattedMessage: props => (
    <div componentName="Formatted Message Component" {...props} />
  )
}));
jest.mock('../../PrivacyModal/privacyModal', () => 'PrivacyModal');
jest.mock('@magento/venia-ui/lib/components/LinkButton', () => 'LinkButton');

test('renders default policyButton', () => {
  usePolicyButton.mockReturnValue({
    isShowMode: true
  });

  const tree = createTestInstance(
    <PolicyButton item={{ title: 'title' }} index={0} />
  );
  expect(tree.toJSON()).toMatchSnapshot();
});
