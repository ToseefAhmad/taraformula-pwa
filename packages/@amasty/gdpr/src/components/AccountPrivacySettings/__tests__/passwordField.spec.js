import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import PasswordField from '../passwordField';

jest.mock('@magento/venia-ui/lib/components/Password', () => 'Password');
jest.mock('react-intl', () => ({
  useIntl: jest.fn().mockReturnValue({
    formatMessage: jest
      .fn()
      .mockImplementation(options => options.defaultMessage)
  })
}));

test('renders needPassword false', () => {
  const props = {
    item: {
      needPassword: false,
      action: true
    },
    isShowPassword: true
  };

  const tree = createTestInstance(<PasswordField {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders action false', () => {
  const props = {
    item: {
      needPassword: true,
      action: false
    },
    isShowPassword: true
  };

  const tree = createTestInstance(<PasswordField {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders isShowPassword false', () => {
  const props = {
    item: {
      needPassword: true,
      action: true
    },
    isShowPassword: false
  };

  const tree = createTestInstance(<PasswordField {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders default', () => {
  const props = {
    item: {
      needPassword: true,
      action: true
    },
    isShowPassword: true
  };
  const tree = createTestInstance(<PasswordField {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
