import { render, screen } from '@testing-library/react';
import React from 'react';
import { App } from '../App';

test('renders Request Funds label', () => {
  render(<App />);
  const linkElement = screen.getByText(/Request Funds/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders Amount label', () => {
  render(<App />);
  const linkElement = screen.getByText(/Amount/i);
  expect(linkElement).toBeInTheDocument();
});
