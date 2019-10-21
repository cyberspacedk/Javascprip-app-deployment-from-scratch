import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

describe('test', () => {
  it('check', () => {
    expect(true).toBe(true);
    render(<App />);
  });
});
