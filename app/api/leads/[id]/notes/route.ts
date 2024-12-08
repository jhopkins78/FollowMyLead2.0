import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  // This is mock data. In a real application, you would fetch this from your database.
  const lead = {
    id,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    company: 'Acme Inc.',
    score: 85,
    status: 'qualified',
    created_at: '2023-01-01T00:00:00Z',
    notes: [],
    last_contact: null,
    industry: 'Technology',
    location: 'New York, NY',
    source: 'Website',
    estimated_value: 10000,
  }

  return NextResponse.json(lead)
}

