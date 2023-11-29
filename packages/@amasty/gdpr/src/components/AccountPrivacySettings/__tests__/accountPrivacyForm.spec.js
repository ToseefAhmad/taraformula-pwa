import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import AccountPrivacyForm from '../accountPrivacyForm';
import { useAccountPrivacyForm } from '../../../talons/useAccountPrivacyForm';
import { Form } from 'informed';
jest.mock('@magento/venia-ui/lib/components/FormError', () => 'FormError');
jest.mock('@magento/venia-ui/lib/components/RichContent', () => 'RichContent');
jest.mock(
  '@magento/venia-ui/lib/components/ButtonGroup/button',
  () => 'Button'
);
jest.mock('../accountCheckbox', () => 'AccountCheckbox');
jest.mock('../passwordField', () => 'PasswordField');
jest.mock('../../AmCheckbox', () => 'AmCheckbox');
jest.mock('../../SuccessMessage', () => 'SuccessMessage');
jest.mock('../../DownloadCsv', () => 'DownloadCsv');
jest.mock('../../../talons/useAccountPrivacyForm', () => {
  const useAccountPrivacyForm = jest.fn(() => {});

  return { useAccountPrivacyForm };
});

const props = {
  index: 0,
  item: {
    hidePassword: false,
    actionCode: 'test',
    title: 'test',
    content: 'test'
  }
};

test('renders default', () => {
  useAccountPrivacyForm.mockReturnValue({
    isShowPassword: false,
    customerData: []
  });

  const tree = createTestInstance(
    <Form>
      <AccountPrivacyForm {...props} />
    </Form>
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders with checkboxes', () => {
  useAccountPrivacyForm.mockReturnValue({
    isShowPassword: false,
    customerData: []
  });

  props.item.actionCode = 'given_consents';

  const tree = createTestInstance(<AccountPrivacyForm {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
