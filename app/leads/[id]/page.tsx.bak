'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLeadDetails, updateLeadStatus, addLeadNote } from '@/frontend/src/services/api';
import type { LeadDetails, LeadNote, LeadStatus } from '@/frontend/src/types/leads';
import { Button } from '@/frontend/src/components/ui/button';
import { Input } from '@/frontend/src/components/ui/input';
import { Label } from '@/frontend/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/frontend/src/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/src/components/ui/card';
import { format } from 'date-fns';

export default function LeadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<LeadDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const leadStatuses: LeadStatus[] = [
    'new',
    'contacted',
    'qualified',
    'proposal',
    'negotiation',
    'closed',
    'lost'
  ];

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const data = await getLeadDetails(params.id as string);
        setLead(data);
      } catch (err) {
        setError('Failed to fetch lead details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [params.id]);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;
    
    try {
      await updateLeadStatus(lead.id, newStatus);
      setLead({ ...lead, status: newStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Failed to update lead status');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !newNote.trim() || submitting) return;

    setSubmitting(true);
    try {
      const note = await addLeadNote(lead.id, newNote);
      setLead({
        ...lead,
        notes: [...lead.notes, note],
      });
      setNewNote('');
    } catch (err) {
      console.error('Failed to add note:', err);
      setError('Failed to add note');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4">Lead not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          ← Back to Leads
        </Button>
        <h1 className="text-3xl font-bold">{lead.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lead Information */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Lead Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <p className="text-gray-700">{lead.email}</p>
              </div>
              {lead.phone && (
                <div>
                  <Label>Phone</Label>
                  <p className="text-gray-700">{lead.phone}</p>
                </div>
              )}
              {lead.company && (
                <div>
                  <Label>Company</Label>
                  <p className="text-gray-700">{lead.company}</p>
                </div>
              )}
              <div>
                <Label>Source</Label>
                <p className="text-gray-700">{lead.source}</p>
              </div>
              <div>
                <Label>Created</Label>
                <p className="text-gray-700">
                  {format(new Date(lead.createdAt), 'PPP')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={lead.status}
              onValueChange={(value) => handleStatusChange(value as LeadStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {leadStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddNote} className="mb-6">
              <div className="flex gap-4">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1"
                />
                <Button type="submit" disabled={submitting || !newNote.trim()}>
                  Add Note
                </Button>
              </div>
            </form>

            <div className="space-y-4">
              {lead.notes.map((note: LeadNote) => (
                <div
                  key={note.id}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <p className="text-gray-700">{note.content}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>{format(new Date(note.createdAt), 'PPP')}</span>
                    <span className="mx-2">•</span>
                    <span>{note.createdBy}</span>
                  </div>
                </div>
              ))}
              {lead.notes.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No notes yet. Add one above.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
