import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import FileUpload from '@/app/upload/page';
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
  pathname: '/upload'
};

const renderFileUpload = () => {
  (useRouter as jest.Mock).mockReturnValue(mockRouter);
  return render(
    <AuthProvider>
      <FileUpload />
    </AuthProvider>
  );
};

describe('FileUpload Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders file upload interface', () => {
    renderFileUpload();
    expect(screen.getByText(/upload leads/i)).toBeInTheDocument();
    expect(screen.getByText(/drag and drop a csv file here/i)).toBeInTheDocument();
  });

  it('shows file type validation error for non-CSV files', async () => {
    renderFileUpload();
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const dropzone = screen.getByText(/drag and drop a csv file here/i).closest('div');
    
    Object.defineProperty(dropzone, 'files', {
      value: [file],
    });
    
    fireEvent.drop(dropzone as HTMLElement);
    
    await waitFor(() => {
      expect(api.uploadLeads).not.toHaveBeenCalled();
    });
  });

  it('handles successful file upload', async () => {
    const file = new File(['test,data\n1,2'], 'test.csv', { type: 'text/csv' });
    (api.uploadLeads as any).mockResolvedValueOnce({ data: { message: 'Upload successful' } });
    
    renderFileUpload();
    
    const dropzone = screen.getByText(/drag and drop a csv file here/i).closest('div');
    
    Object.defineProperty(dropzone, 'files', {
      value: [file],
    });
    
    fireEvent.drop(dropzone as HTMLElement);
    
    await waitFor(() => {
      expect(api.uploadLeads).toHaveBeenCalledWith(file);
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles upload failure', async () => {
    const file = new File(['test,data\n1,2'], 'test.csv', { type: 'text/csv' });
    const errorMessage = 'Upload failed';
    (api.uploadLeads as any).mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });
    
    renderFileUpload();
    
    const dropzone = screen.getByText(/drag and drop a csv file here/i).closest('div');
    
    Object.defineProperty(dropzone, 'files', {
      value: [file],
    });
    
    fireEvent.drop(dropzone as HTMLElement);
    
    await waitFor(() => {
      expect(api.uploadLeads).toHaveBeenCalledWith(file);
    });
  });

  it('shows required columns information', () => {
    renderFileUpload();
    expect(screen.getByText(/name, email, phone, company/i)).toBeInTheDocument();
  });
});
