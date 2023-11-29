import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import SuccessMessage from '../successMessage';

test('renders default successMessage', () => {
  const tree = createTestInstance(<SuccessMessage message={'test'} />);
  expect(tree.toJSON()).toMatchSnapshot();
});

test('renders no message', () => {
  const tree = createTestInstance(<SuccessMessage message={''} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
