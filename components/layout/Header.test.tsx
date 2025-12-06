// components/layout/Header.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@library-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('Header', () => {
  it('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByAltText('FleetMan')).toBeInTheDocument();
  });

  it('displays default user name when not provided', () => {
    render(<Header />);
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('displays custom user name when provided', () => {
    render(<Header userName="Jean Dupont" />);
    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
  });

  it('calls onMenuToggle when menu button is clicked', () => {
    const mockToggle = jest.fn();
    render(<Header onMenuToggle={mockToggle} />);
    
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('toggles menu icon on click', () => {
    render(<Header />);
    
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    
    // Initial state - should show menu icon
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click to toggle
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    
    // Click again to toggle back
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('has correct links for help and profile', () => {
    render(<Header />);
    
    const helpLink = screen.getByLabelText(/aide et support/i);
    expect(helpLink).toHaveAttribute('href', '/support');
    
    const profileLink = screen.getByLabelText(/profil de user/i);
    expect(profileLink).toHaveAttribute('href', '/profile');
  });

  it('has correct logo link', () => {
    render(<Header />);
    
    const logo = screen.getByAltText('FleetMan');
    const logoLink = logo.closest('a');
    
    expect(logoLink).toHaveAttribute('href', '/dashboard');
  });

  it('applies hover styles to user badge', () => {
    const { container } = render(<Header />);
    
    const userBadge = container.querySelector('a[href="/profile"]');
    expect(userBadge).toHaveClass('userBadge');
  });
});