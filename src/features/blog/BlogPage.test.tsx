import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BlogPage from './BlogPage';
import { AuthProvider } from '../../hooks/useAuth';

const adminUser = { user: { role: 'admin', name: 'Admin', email: 'admin@example.com' }, isAuthenticated: true, isLoading: false };
const regularUser = { user: { role: 'user', name: 'User', email: 'user@example.com' }, isAuthenticated: true, isLoading: false };

function renderWithAuth(userContext: any) {
  return render(
    <AuthProvider value={userContext}>
      <BlogPage />
    </AuthProvider>
  );
}

describe('BlogPage', () => {
  it('renders and shows create button for admin', () => {
    renderWithAuth(adminUser);
    expect(screen.getByText('+ Create Blog')).toBeInTheDocument();
  });

  it('does not show create button for regular user', () => {
    renderWithAuth(regularUser);
    expect(screen.queryByText('+ Create Blog')).not.toBeInTheDocument();
  });

  it('shows loading state', () => {
    renderWithAuth(adminUser);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});