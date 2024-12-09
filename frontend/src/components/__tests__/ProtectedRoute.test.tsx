import React from 'react';
import { render } from '@testing-library/react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    asPath: '/protected'
  })
}));

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ProtectedRoute Component', () => {
  const TestComponent = () => <div>Protected Content</div>;
  
  const renderProtectedRoute = (user: any = null) => {
    (require('@/contexts/AuthContext') as any).useAuth.mockReturnValue({ user });
    
    return render(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );
  };

  it('renders children when user is authenticated', () => {
    const { getByText } = renderProtectedRoute({ id: 1, email: 'test@example.com' });
    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  it('returns null when user is not authenticated', () => {
    const { container } = renderProtectedRoute(null);
    expect(container.firstChild).toBeNull();
  });

  it('calls router.push with correct params when not authenticated', () => {
    const mockPush = vi.fn();
    (require('next/router') as any).useRouter.mockReturnValue({
      push: mockPush,
      asPath: '/protected'
    });

    renderProtectedRoute(null);
    
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/login',
      query: { returnUrl: '/protected' }
    });
  });
});
