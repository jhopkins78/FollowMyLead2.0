import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { AuthProvider } from '../../contexts/AuthContext';
import { vi } from 'vitest';

// Mock the useAuth hook
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ProtectedRoute Component', () => {
  const TestComponent = () => <div>Protected Content</div>;
  
  const renderProtectedRoute = (user: any = null) => {
    (require('../../contexts/AuthContext') as any).useAuth.mockReturnValue({ user });
    
    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders children when user is authenticated', () => {
    const { getByText } = renderProtectedRoute({ id: 1, email: 'test@example.com' });
    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    const { getByText } = renderProtectedRoute(null);
    expect(getByText('Login Page')).toBeInTheDocument();
  });

  it('preserves the redirect location', () => {
    renderProtectedRoute(null);
    const location = window.location;
    expect(location.pathname).toBe('/login');
  });
});
