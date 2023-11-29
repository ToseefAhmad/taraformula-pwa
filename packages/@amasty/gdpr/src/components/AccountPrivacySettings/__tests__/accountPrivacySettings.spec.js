import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import AccountPrivacySettings from '../accountPrivacySettings';
import { useAccountPrivacySettings } from '../../../talons/useAccountPrivacySettings';

jest.mock('@magento/venia-ui/lib/components/FormError', () => 'FormError');
jest.mock('@magento/venia-ui/lib/components/RichContent', () => 'RichContent');
jest.mock(
  '@magento/venia-ui/lib/components/ButtonGroup/button',
  () => 'Button'
);
jest.mock('../../PolicyButton', () => 'PolicyButton');
jest.mock('../accountPrivacyForm', () => 'AccountPrivacyForm');
jest.mock('../../../talons/useAccountPrivacySettings', () => {
  const useAccountPrivacySettings = jest.fn(() => {});

  return { useAccountPrivacySettings };
});
jest.mock('@magento/venia-ui/lib/components/LoadingIndicator', () => {
  return {
    fullPageLoadingIndicator: 'LoadingIndicator'
  };
});

test('renders loading', () => {
  useAccountPrivacySettings.mockReturnValue({
    loading: true
  });

  const tree = createTestInstance(<AccountPrivacySettings />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders no settings', () => {
  useAccountPrivacySettings.mockReturnValue({
    loading: false,
    settings: []
  });

  const tree = createTestInstance(<AccountPrivacySettings />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders PolicyButton', () => {
  useAccountPrivacySettings.mockReturnValue({
    loading: false,
    settings: [
      {
        action: false,
        content: false
      }
    ]
  });

  const tree = createTestInstance(<AccountPrivacySettings />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders default', () => {
  useAccountPrivacySettings.mockReturnValue({
    loading: false,
    settings: [
      {
        action: true,
        content: true
      }
    ]
  });

  const tree = createTestInstance(<AccountPrivacySettings />);
  expect(tree.toJSON()).toMatchSnapshot();
});
