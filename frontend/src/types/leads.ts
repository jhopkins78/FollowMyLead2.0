export interface LeadDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  source: string;
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface NoteFormData {
  content: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  createdAt: string;
}
