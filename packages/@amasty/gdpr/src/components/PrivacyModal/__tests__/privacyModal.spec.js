import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import PrivacyModal from '../privacyModal';

jest.mock('../../Modal/Modal', () => 'Modal');
jest.mock('@magento/venia-ui/lib/components/RichContent', () => 'RichContent');
jest.mock('react-intl', () => ({
  FormattedMessage: props => (
    <div componentName="Formatted Message Component" {...props} />
  ),
  useIntl: jest.fn().mockReturnValue({
    formatMessage: jest
      .fn()
      .mockImplementation(options => options.defaultMessage)
  })
}));

test('renders no content privacyModal', () => {
  const tree = createTestInstance(<PrivacyModal content={{ content: '' }} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders versionChanged false', () => {
  const tree = createTestInstance(
    <PrivacyModal
      isVersionChanged={false}
      content={{ content: '<div>test</div>' }}
    />
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders versionChanged true', () => {
  const tree = createTestInstance(
    <PrivacyModal
      isVersionChanged={true}
      content={{ content: '<div>test</div>' }}
    />
  );
  expect(tree.toJSON()).toMatchSnapshot();
});
