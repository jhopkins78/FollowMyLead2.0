'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getLeadDetails, updateLeadStatus, addLeadNote } from '@/services/api'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface LeadNote {
  id: string
  content: string
  created_at: string
  created_by: string
}

interface LeadDetails {
  id: string
  name: string
  email: string
  phone: string
  company: string
  score: number
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  created_at: string
  notes: LeadNote[]
  last_contact: string | null
  industry: string
  location: string
  source: string
  estimated_value: number
}

interface NoteFormData {
  content: string
}

export default function LeadDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [lead, setLead] = useState<LeadDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const { register: noteRegister, handleSubmit: handleNoteSubmit, reset: resetNoteForm } = useForm<NoteFormData>()

  useEffect(() => {
    fetchLeadDetails()
  }, [id])

  const fetchLeadDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getLeadDetails(id)
      setLead(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lead details')
      toast.error('Failed to fetch lead details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: LeadDetails['status']) => {
    if (!lead) return
    try {
      setIsUpdatingStatus(true)
      await updateLeadStatus(id, newStatus)
      setLead({ ...lead, status: newStatus })
      toast.success('Status updated successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update status')
      // Revert the status in UI
      setLead({ ...lead })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const onNoteSubmit = async (data: NoteFormData) => {
    if (!lead) return
    try {
      setIsAddingNote(true)
      const newNote = await addLeadNote(id, data.content)
      setLead({
        ...lead,
        notes: [newNote, ...lead.notes]
      })
      resetNoteForm()
      toast.success('Note added successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add note')
    } finally {
      setIsAddingNote(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusColor = (status: LeadDetails['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      converted: 'bg-purple-100 text-purple-800',
      lost: 'bg-gray-100 text-gray-800'
    }
    return colors[status]
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/dashboard')} className="mt-4">
          Return to Dashboard
        </Button>
      </div>
    )
  }

  if (isLoading || !lead) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="sm:col-span-1">
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full mb-4" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="mb-4">
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {lead.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{lead.company}</p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lead Information</CardTitle>
          </CardHeader>
          <CardContent>
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
                <dt className="text-sm font-medium text-gray-500">Source</dt>
                <dd className="mt-1 text-sm text-gray-900">{lead.source}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <Select 
                    value={lead.status} 
                    onValueChange={handleStatusChange}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className={`text-sm rounded-full px-3 py-1 font-semibold ${getStatusColor(lead.status)}`}>
                      <SelectValue>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {['new', 'contacted', 'qualified', 'converted', 'lost'].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Estimated Value</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  ${lead.estimated_value.toLocaleString()}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(lead.created_at), 'MMMM dd, yyyy')}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Last Contact</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {lead.last_contact ? format(new Date(lead.last_contact), 'MMMM dd, yyyy') : 'Never'}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Lead Score</dt>
                <dd className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreColor(lead.score)}`}>
                    {lead.score}
                  </span>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNoteSubmit(onNoteSubmit)} className="mb-6">
              <div>
                <Label htmlFor="content" className="sr-only">
                  Add a note
                </Label>
                <Input
                  id="content"
                  rows={3}
                  className="shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Add a note..."
                  {...noteRegister('content', { required: true })}
                  disabled={isAddingNote}
                />
              </div>
              <div className="mt-3">
                <Button type="submit" disabled={isAddingNote}>
                  {isAddingNote ? 'Adding Note...' : 'Add Note'}
                </Button>
              </div>
            </form>

            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {lead.notes.map((note, noteIdx) => (
                  <li key={note.id}>
                    <div className="relative pb-8">
                      {noteIdx !== lead.notes.length - 1 ? (
                        <span
                          className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ring-8 ring-white">
                            <span className="text-sm font-medium text-gray-500">
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
                              {format(new Date(note.created_at), 'MMMM dd, yyyy')}
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
