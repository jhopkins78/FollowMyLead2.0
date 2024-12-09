import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getLeadDetails, updateLeadStatus, addLeadNote } from '../services/api';
import { LeadDetails as ILeadDetails, LeadNote, LeadStatus, NoteFormData } from '@/types/leads';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface LeadDetails extends ILeadDetails {
  notes: LeadNote[];
}

export const LeadDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [lead, setLead] = useState<LeadDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { register: noteRegister, handleSubmit: handleNoteSubmit, reset: resetNoteForm } = useForm<NoteFormData>();

  useEffect(() => {
    if (id) {
      fetchLeadDetails();
    }
  }, [id]);

  const fetchLeadDetails = async () => {
    try {
      const data = await getLeadDetails(id as string);
      setLead(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch lead details');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    try {
      await updateLeadStatus(id as string, newStatus);
      setLead(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success('Status updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const onNoteSubmit = async (data: NoteFormData) => {
    try {
      const newNote = await addLeadNote(id as string, data.content);
      setLead(prev => prev ? { ...prev, notes: [newNote, ...prev.notes] } : null);
      resetNoteForm();
      toast.success('Note added successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add note');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: LeadStatus) => {
    const colors: Record<LeadStatus, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      proposal: 'bg-indigo-100 text-indigo-800',
      negotiation: 'bg-purple-100 text-purple-800',
      closed: 'bg-teal-100 text-teal-800',
      lost: 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!lead) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 truncate">{lead.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{lead.company}</p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Lead Information</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.phone}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Industry</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.industry}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.location}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Lead Score</dt>
                <dd className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreColor(lead.score)}`}>
                    {lead.score}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                    className={`text-sm rounded-full px-3 py-1 font-semibold ${getStatusColor(lead.status)}`}
                  >
                    {['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed', 'lost'].map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Source</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.source}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Estimated Value</dt>
                <dd className="mt-1 text-sm text-gray-900">${lead.estimated_value.toLocaleString()}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(lead.created_at).toLocaleDateString()}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Last Contact</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {lead.last_contact ? new Date(lead.last_contact).toLocaleDateString() : 'Never'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Notes</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <form onSubmit={handleNoteSubmit(onNoteSubmit)} className="mb-6">
              <div>
                <label htmlFor="content" className="sr-only">
                  Add a note
                </label>
                <textarea
                  id="content"
                  rows={3}
                  className="shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Add a note..."
                  {...noteRegister('content', { required: true })}
                />
              </div>
              <div className="mt-3">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add Note
                </button>
              </div>
            </form>

            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {lead.notes.map((note, noteIdx) => (
                  <li key={note.id}>
                    <div className="relative pb-8">
                      {noteIdx !== lead.notes.length - 1 ? (
                        <span
                          className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                            <span className="text-sm font-medium text-white">
                              {note.created_by.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">
                                {note.created_by}
                              </span>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              {new Date(note.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-700">
                            <p>{note.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
