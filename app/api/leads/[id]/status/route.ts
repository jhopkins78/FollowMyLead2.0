import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const { status } = await request.json()

  // In a real application, you would update the status in your database here.
  console.log(`Updating status for lead ${id} to ${status}`)

  return NextResponse.json({ success: true, message: 'Status updated successfully' })
}

