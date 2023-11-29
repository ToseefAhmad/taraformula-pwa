import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import AmCheckbox from '../amCheckbox';
import { useAmGdprContext } from '../../../context';

jest.mock('../checkboxWithModal', () => 'CheckboxWithModal');
jest.mock('../../../context', () => {
  const useAmGdprContext = jest.fn(() => {});

  return { useAmGdprContext };
});

test('renders no checkboxes', () => {
  useAmGdprContext.mockReturnValue({
    settings: []
  });

  const tree = createTestInstance(<AmCheckbox isAccountSettingsPage={true} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders default amCheckbox', () => {
  useAmGdprContext.mockReturnValue({
    settings: [
      {
        hide_the_consent_after_user_left_the_consent: true
      }
    ]
  });

  const tree = createTestInstance(<AmCheckbox isAccountSettingsPage={true} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
