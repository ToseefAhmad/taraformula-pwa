import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import PrivacyPolicy from '../privacyPolicy';
import { usePrivacyPolicy } from '../../../talons/usePrivacyPolicy';

jest.mock('../../../talons/usePrivacyPolicy', () => {
  const usePrivacyPolicy = jest.fn(() => {});

  return { usePrivacyPolicy };
});
jest.mock('../../PrivacyModal/privacyModal', () => 'PrivacyModal');

test('renders loading true ', () => {
  usePrivacyPolicy.mockReturnValue({
    loading: true
  });

  const tree = createTestInstance(<PrivacyPolicy />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders isModalClosed true ', () => {
  usePrivacyPolicy.mockReturnValue({
    isModalClosed: true
  });

  const tree = createTestInstance(<PrivacyPolicy />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders privacyData needShow false ', () => {
  usePrivacyPolicy.mockReturnValue({
    policyData: {
      need_show: false
    }
  });

  const tree = createTestInstance(<PrivacyPolicy />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders privacyPolicy ', () => {
  usePrivacyPolicy.mockReturnValue({
    policyData: {
      need_show: true,
      content: '<div>test</div>'
    }
  });

  const tree = createTestInstance(<PrivacyPolicy />);
  expect(tree.toJSON()).toMatchSnapshot();
});
