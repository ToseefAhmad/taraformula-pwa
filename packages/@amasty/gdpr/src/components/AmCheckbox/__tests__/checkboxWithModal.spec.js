import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import CheckboxWithModal from '../checkboxWithModal';
import { useCheckboxWithModal } from '../../../talons/useCheckboxWithModal';

jest.mock('@magento/venia-ui/lib/components/FormError', () => 'FormError');
jest.mock('@magento/venia-ui/lib/components/Field', () => 'Message');
jest.mock(
  '@magento/venia-ui/lib/components/Checkbox/checkbox',
  () => 'Checkbox'
);
jest.mock('../label', () => 'Label');
jest.mock('../../PrivacyModal/privacyModal', () => 'PrivacyModal');
jest.mock('../../SuccessMessage', () => 'SuccessMessage');
jest.mock('../../../talons/useCheckboxWithModal', () => {
  const useCheckboxWithModal = jest.fn(() => {});

  return { useCheckboxWithModal };
});

const props = {
  item: {
    consent_code: 'test',
    consent_id: 0,
    consent_text: 'text',
    is_required: true
  },
  location: 'test'
};

test('renders no checkboxes', () => {
  useCheckboxWithModal.mockReturnValue({
    errors: ['error'],
    isAccountSettingsPage: false
  });

  const tree = createTestInstance(<CheckboxWithModal {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders with success message', () => {
  useCheckboxWithModal.mockReturnValue({
    isAccountSettingsPage: false,
    formSubmitMessage: 'test'
  });

  const tree = createTestInstance(<CheckboxWithModal {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
