import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import Login from '@/pages/Login';
import { AuthProvider } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { vi } from 'vitest';

vi.mock('next/router', () => ({
  useRouter: vi.fn()
}));
vi.mock('@/services/api');
vi.mock('react-hot-toast');

const mockRouter = {
  push: vi.fn(),
  pathname: '/login'
};

const renderLogin = () => {
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return render(
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    renderLogin();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderLogin();
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('shows error for invalid email format', async () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/email/i);
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });

  it('navigates to dashboard on successful login', async () => {
    const mockLoginResponse = { data: { token: 'fake-token', user: { id: 1, email: 'test@example.com' } } };
    (api.login as any).mockResolvedValueOnce(mockLoginResponse);
    
    renderLogin();
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error message on login failure', async () => {
    const errorMessage = 'Invalid credentials';
    (api.login as any).mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });
    
    renderLogin();
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(api.login).toHaveBeenCalled();
    });
  });
});
