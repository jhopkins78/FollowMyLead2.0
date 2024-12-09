'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { getLeads, updateLeadStatus } from '@/services/api'
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  score: number
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  created_at: string
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortField, setSortField] = useState<keyof Lead>('score')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const { toast } = useToast()

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await getLeads()
      setLeads(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Failed to fetch leads',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (leadId: string, newStatus: Lead['status']) => {
    try {
      await updateLeadStatus(leadId, newStatus)
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ))
      toast({
        title: "Success",
        description: "Status updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || 'Failed to update status',
        variant: "destructive",
      })
    }
  }

  const sortLeads = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedLeads = [...leads].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    const direction = sortDirection === 'asc' ? 1 : -1
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * direction
    }
    return String(aValue).localeCompare(String(bValue)) * direction
  })

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusColor = (status: Lead['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      converted: 'bg-purple-100 text-purple-800',
      lost: 'bg-gray-100 text-gray-800'
    }
    return colors[status]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Lead Dashboard</h1>
          <Link href="/upload" passHref>
            <Button>
              Upload Leads
            </Button>
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Email', 'Company', 'Score', 'Status', 'Created At'].map((header, index) => (
                    <th
                      key={index}
                      onClick={() => sortLeads(header.toLowerCase().replace(' ', '_') as keyof Lead)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        {header}
                        {sortField === header.toLowerCase().replace(' ', '_') && (
                          <span className="ml-2">
                            {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/leads/${lead.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{lead.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusUpdate(lead.id, e.target.value as Lead['status'])}
                        className={`text-sm rounded-full px-3 py-1 font-semibold ${getStatusColor(lead.status)}`}
                      >
                        {['new', 'contacted', 'qualified', 'converted', 'lost'].map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
