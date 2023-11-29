import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Label from '../label';

jest.mock('@magento/venia-ui/lib/components/LinkButton', () => 'LinkButton');
jest.mock('react-intl', () => ({
  FormattedMessage: props => (
    <div componentName="Formatted Message Component" {...props} />
  )
}));

const handleClick = jest.fn().mockName('handleClick');
const defaultProps = {
  id: 0,
  handleClick
};

test('renders default', () => {
  const props = {
    ...defaultProps,
    message: {}
  };

  const tree = createTestInstance(<Label {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders with only prevText', () => {
  const props = {
    ...defaultProps,
    message: {
      prevText: 'test'
    }
  };
  const tree = createTestInstance(<Label {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders with only text', () => {
  const props = {
    ...defaultProps,
    message: {
      text: 'test'
    }
  };
  const tree = createTestInstance(<Label {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders with only afterText', () => {
  const props = {
    ...defaultProps,
    message: {
      afterText: 'test'
    }
  };
  const tree = createTestInstance(<Label {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders with all link', () => {
  const props = {
    ...defaultProps,
    message: {
      prevText: 'test',
      text: 'test',
      afterText: 'test'
    }
  };
  const tree = createTestInstance(<Label {...props} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
