import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as api from '@/services/api';
import { LeadDetails } from '@/types/leads';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await api.getLeads();
      setLeads(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch leads');
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpload = () => {
    router.push('/upload');
  };

  const handleViewDetails = (leadId: string) => {
    router.push(`/leads/${leadId}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads Dashboard</h1>
        <Button onClick={handleUpload}>Upload Leads</Button>
      </div>

      <Input
        type="text"
        placeholder="Search leads..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-6"
      />

      {filteredLeads.length === 0 ? (
        <div className="text-center text-gray-500">
          No leads found. Try uploading some leads or adjusting your search.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">{lead.name}</h3>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    lead.score && lead.score >= 80
                      ? 'bg-green-100 text-green-800'
                      : lead.score && lead.score >= 50
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {lead.score ? `${lead.score}%` : 'N/A'}
                </span>
              </div>
              <p className="text-sm text-gray-600">{lead.email}</p>
              {lead.company && (
                <p className="text-sm text-gray-600">{lead.company}</p>
              )}
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => handleViewDetails(lead.id)}
              >
                View Details
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
