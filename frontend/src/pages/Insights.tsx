import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { getInsights } from '../services/api';
import toast from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface InsightData {
  leadSourceDistribution: { [key: string]: number };
  conversionRates: { [key: string]: number };
  engagementMetrics: {
    averageTimeSpent: number;
    averagePageViews: number;
    totalVisits: { [key: string]: number };
  };
  qualityMetrics: {
    leadQualityDistribution: { [key: string]: number };
    profileScoreDistribution: { [key: string]: number };
  };
}

export const Insights: React.FC = () => {
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInsights = async () => {
    try {
      const response = await getInsights();
      setInsightData(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch insights data');
      console.error('Error fetching insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading insights...</div>;
  }

  if (!insightData) {
    return <div className="flex justify-center items-center h-screen">No insight data available</div>;
  }

  // Chart configurations
  const conversionRateChart = {
    labels: Object.keys(insightData.conversionRates),
    datasets: [{
      label: 'Conversion Rate',
      data: Object.values(insightData.conversionRates),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    }]
  };

  const leadSourceChart = {
    labels: Object.keys(insightData.leadSourceDistribution),
    datasets: [{
      label: 'Lead Source Distribution',
      data: Object.values(insightData.leadSourceDistribution),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
    }]
  };

  const qualityChart = {
    labels: Object.keys(insightData.qualityMetrics.leadQualityDistribution),
    datasets: [{
      label: 'Lead Quality Distribution',
      data: Object.values(insightData.qualityMetrics.leadQualityDistribution),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    }]
  };

  const engagementChart = {
    labels: Object.keys(insightData.engagementMetrics.totalVisits),
    datasets: [{
      label: 'Visit Distribution',
      data: Object.values(insightData.engagementMetrics.totalVisits),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    }]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lead Insights Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Conversion Rate Overview */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Conversion Rate Overview</h2>
          <Bar data={conversionRateChart} options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' as const },
              title: { display: true, text: 'Conversion Rates by Source' }
            }
          }} />
        </div>

        {/* Lead Source Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Lead Source Distribution</h2>
          <Pie data={leadSourceChart} options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' as const },
            }
          }} />
        </div>

        {/* Lead Quality Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Lead Quality Distribution</h2>
          <Bar data={qualityChart} options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' as const },
            }
          }} />
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Engagement Trends</h2>
          <Line data={engagementChart} options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' as const },
            }
          }} />
        </div>

        {/* Key Metrics Summary */}
        <div className="bg-white p-6 rounded-lg shadow-lg col-span-full">
          <h2 className="text-xl font-semibold mb-4">Key Metrics Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-gray-600">Average Time Spent</p>
              <p className="text-2xl font-bold">{insightData.engagementMetrics.averageTimeSpent.toFixed(2)} mins</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Average Page Views</p>
              <p className="text-2xl font-bold">{insightData.engagementMetrics.averagePageViews.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Total Lead Sources</p>
              <p className="text-2xl font-bold">{Object.keys(insightData.leadSourceDistribution).length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
