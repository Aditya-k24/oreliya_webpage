/// <reference types="vitest" />
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renders the logo and navigation links', () => {
    render(<Header />);

    expect(screen.getByAltText('Oreliya')).toBeInTheDocument();
    expect(screen.getByText('Custom Design')).toBeInTheDocument();
    expect(screen.getByText('Heritage')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('renders the logo link with correct href', () => {
    render(<Header />);

    const logoLink = screen.getByLabelText('Oreliya homepage');
    expect(logoLink).toHaveAttribute('href', '/');
  });
});
