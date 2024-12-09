import React from 'react';
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import App from '@/app/page';
import { AuthProvider } from '@/contexts/AuthContext';
import { vi } from 'vitest';

vi.mock('next/router', () => ({
  useRouter: vi.fn()
}));

const mockRouter = {
  push: vi.fn(),
  pathname: '/'
};

describe('App Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders without crashing', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
  });
});
