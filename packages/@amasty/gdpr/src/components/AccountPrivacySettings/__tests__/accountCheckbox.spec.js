import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import AccountCheckbox from '../accountCheckbox';

jest.mock(
  '@magento/venia-ui/lib/components/Checkbox/checkbox',
  () => 'Checkbox'
);
jest.mock('react-intl', () => ({
  useIntl: jest.fn().mockReturnValue({
    formatMessage: jest
      .fn()
      .mockImplementation(options => options.defaultMessage)
  })
}));
const props = {
  index: 0
};

test('renders no checkbox', () => {
  const tree = createTestInstance(
    <AccountCheckbox
      item={{ hasCheckbox: false, checkboxText: 'test' }}
      {...props}
    />
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders versionChanged false', () => {
  const tree = createTestInstance(
    <AccountCheckbox
      item={{ hasCheckbox: true, checkboxText: 'test' }}
      {...props}
    />
  );
  expect(tree.toJSON()).toMatchSnapshot();
});
