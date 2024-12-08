export interface LeadDetails {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
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

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost';
