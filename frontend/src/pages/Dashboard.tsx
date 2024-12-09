import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as api from '@/services/api';
import { LeadDetails } from '@/types/leads';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await api.getLeads();
      setLeads(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch leads');
      setLoading(false);
    }
  };

  const handleViewDetails = (leadId: string) => {
    router.push(`/leads/${leadId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div role="status" className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leads Dashboard</h1>
        <Button onClick={() => router.push('/upload')}>
          Upload Leads
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead) => (
          <Card key={lead.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
                <p className="text-sm text-gray-500">{lead.company}</p>
              </div>
              {lead.score !== undefined && (
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    lead.score >= 80
                      ? 'bg-green-100 text-green-800'
                      : lead.score >= 50
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  Score: {lead.score}
                </span>
              )}
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">{lead.email}</p>
              <p className="text-sm text-gray-600">{lead.phone}</p>
              {lead.industry && (
                <p className="text-sm text-gray-600">Industry: {lead.industry}</p>
              )}
              {lead.location && (
                <p className="text-sm text-gray-600">Location: {lead.location}</p>
              )}
            </div>

            {lead.estimated_value && (
              <p className="text-sm font-medium text-gray-900 mb-4">
                Estimated Value: ${lead.estimated_value.toLocaleString()}
              </p>
            )}

            <Button
              onClick={() => handleViewDetails(lead.id)}
              variant="outline"
              className="w-full"
            >
              View Details
            </Button>
          </Card>
        ))}
      </div>

      {leads.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No leads found</h3>
          <p className="text-gray-500 mt-2">Upload some leads to get started</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
