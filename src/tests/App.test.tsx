import { render, screen } from '@testing-library/react';
import React from 'react';
import { RequestFunds } from '../routes/RequestFunds';

test('renders Request Funds label', () => {
  render(<RequestFunds />);
  const linkElement = screen.getByText(/Request Funds/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders Amount label', () => {
  render(<RequestFunds />);
  const linkElement = screen.getByText(/Amount/i);
  expect(linkElement).toBeInTheDocument();
});
