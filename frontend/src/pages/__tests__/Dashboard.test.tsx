import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import Dashboard from '@/app/dashboard/page';
import { AuthProvider } from '@/contexts/AuthContext';
import * as api from '@/services/api';
import { vi } from 'vitest';

vi.mock('next/router', () => ({
  useRouter: vi.fn()
}));
vi.mock('@/services/api');
vi.mock('react-hot-toast');

const mockLeads = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    company: 'ACME Inc',
    score: 85,
    status: 'new',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '098-765-4321',
    company: 'Tech Corp',
    score: 65,
    status: 'contacted',
    created_at: '2023-01-02T00:00:00Z',
  },
];

const mockRouter = {
  push: vi.fn(),
  pathname: '/dashboard'
};

const renderDashboard = () => {
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return render(
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (api.getLeads as any).mockResolvedValue({ data: mockLeads });
  });

  it('renders loading state initially', () => {
    renderDashboard();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders lead data after loading', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });
  });

  it('sorts leads when clicking column headers', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Name'));
    
    const cells = screen.getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('Jane Smith');
  });

  it('updates lead status', async () => {
    (api.updateLeadStatus as any).mockResolvedValueOnce({ data: { message: 'Status updated' } });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    const statusSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(statusSelect, { target: { value: 'qualified' } });
    
    await waitFor(() => {
      expect(api.updateLeadStatus).toHaveBeenCalledWith('1', 'qualified');
    });
  });

  it('handles lead status update failure', async () => {
    const errorMessage = 'Update failed';
    (api.updateLeadStatus as any).mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });
    
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    const statusSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(statusSelect, { target: { value: 'qualified' } });
    
    await waitFor(() => {
      expect(api.updateLeadStatus).toHaveBeenCalled();
    });
  });

  it('displays correct score colors', async () => {
    renderDashboard();
    
    await waitFor(() => {
      const highScore = screen.getByText('85');
      const mediumScore = screen.getByText('65');
      
      expect(highScore).toHaveClass('text-green-600');
      expect(mediumScore).toHaveClass('text-yellow-600');
    });
  });

  it('displays correct status colors', async () => {
    renderDashboard();
    
    await waitFor(() => {
      const newStatus = screen.getByText('new');
      const contactedStatus = screen.getByText('contacted');
      
      expect(newStatus.closest('select')).toHaveClass('bg-blue-100');
      expect(contactedStatus.closest('select')).toHaveClass('bg-yellow-100');
    });
  });

  it('links to upload page', async () => {
    renderDashboard();
    
    await waitFor(() => {
      const uploadLink = screen.getByText(/upload leads/i);
      expect(uploadLink).toHaveAttribute('href', '/upload');
    });
  });

  it('links to lead details', async () => {
    renderDashboard();
    
    await waitFor(() => {
      const detailsLinks = screen.getAllByText(/view details/i);
      expect(detailsLinks[0]).toHaveAttribute('href', '/leads/1');
    });
  });
});
