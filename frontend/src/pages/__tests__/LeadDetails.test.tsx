import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import LeadDetails from '@/app/leads/[id]/page';
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
  pathname: '/leads/[id]',
  query: { id: '123' }
};

const mockLead = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '123-456-7890',
  company: 'ACME Inc',
  score: 85,
  status: 'new',
  created_at: '2023-01-01T00:00:00Z',
  notes: [
    {
      id: '1',
      content: 'Initial contact made',
      created_at: '2023-01-01T00:00:00Z',
      created_by: 'Jane Smith',
    },
  ],
  last_contact: '2023-01-01T00:00:00Z',
  industry: 'Technology',
  location: 'San Francisco, CA',
  source: 'Website',
  estimated_value: 50000,
};

const renderLeadDetails = () => {
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return render(
    <AuthProvider>
      <LeadDetails params={{ id: '123' }} />
    </AuthProvider>
  );
};

describe('LeadDetails Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.getLeadDetails as any).mockResolvedValue({ data: mockLead });
  });

  it('renders loading state initially', () => {
    renderLeadDetails();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders lead details after loading', async () => {
    renderLeadDetails();
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('ACME Inc')).toBeInTheDocument();
    });
  });

  it('updates lead status', async () => {
    (api.updateLeadStatus as any).mockResolvedValueOnce({ data: { message: 'Status updated' } });
    
    renderLeadDetails();
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'qualified' } });
    
    await waitFor(() => {
      expect(api.updateLeadStatus).toHaveBeenCalledWith('1', 'qualified');
    });
  });

  it('adds a new note', async () => {
    const newNote = {
      id: '2',
      content: 'Follow-up scheduled',
      created_at: '2023-01-02T00:00:00Z',
      created_by: 'Test User',
    };
    (api.addLeadNote as any).mockResolvedValueOnce({ data: newNote });
    
    renderLeadDetails();
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    const noteInput = screen.getByPlaceholderText(/add a note/i);
    const submitButton = screen.getByRole('button', { name: /add note/i });
    
    fireEvent.change(noteInput, { target: { value: 'Follow-up scheduled' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(api.addLeadNote).toHaveBeenCalledWith('1', 'Follow-up scheduled');
    });
  });

  it('displays existing notes', async () => {
    renderLeadDetails();
    
    await waitFor(() => {
      expect(screen.getByText('Initial contact made')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('navigates back to dashboard', async () => {
    renderLeadDetails();
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    const backButton = screen.getByRole('button', { name: /back to dashboard/i });
    fireEvent.click(backButton);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
  });

  it('displays correct score color', async () => {
    renderLeadDetails();
    
    await waitFor(() => {
      const scoreElement = screen.getByText('85');
      expect(scoreElement).toHaveClass('text-green-600', 'bg-green-100');
    });
  });

  it('displays correct status color', async () => {
    renderLeadDetails();
    
    await waitFor(() => {
      const statusSelect = screen.getByRole('combobox');
      expect(statusSelect).toHaveClass('bg-blue-100', 'text-blue-800');
    });
  });

  it('handles API errors gracefully', async () => {
    (api.getLeadDetails as any).mockRejectedValueOnce({
      response: { data: { message: 'Failed to fetch lead' } },
    });
    
    renderLeadDetails();
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });
});
