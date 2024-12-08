export async function getLeadDetails(id: string): Promise<LeadDetails> {
  const response = await fetch(`/api/leads/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch lead details')
  }
  const data = await response.json()
  return data
}

export async function updateLeadStatus(id: string, status: LeadDetails['status']): Promise<void> {
  const response = await fetch(`/api/leads/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) {
    throw new Error('Failed to update lead status')
  }
  await response.json() // Consume the response
}

export async function addLeadNote(id: string, content: string): Promise<LeadNote> {
  const response = await fetch(`/api/leads/${id}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })
  if (!response.ok) {
    throw new Error('Failed to add lead note')
  }
  const data = await response.json()
  return data
}

