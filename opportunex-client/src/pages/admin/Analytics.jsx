import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, Users, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { adminAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const adminSidebarLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/admin/users', label: 'Manage Users', icon: <Users className="w-5 h-5" /> },
  { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
];

const COLORS = ['#1E3A5F', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];

const Analytics = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await adminAPI.getAnalytics();
      return response.data.analytics;
    },
  });

  const { data: reportsData } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const response = await adminAPI.getReports({});
      return response.data.reports;
    },
  });

  if (isLoading) return <div>Loading analytics...</div>;

  // Prepare chart data
  const sectorData = analyticsData?.topSectors.map((s) => ({
    name: s.sector || 'Other',
    value: s.count,
  })) || [];

  const applicationStatusData = reportsData?.applicationStats.map((s) => ({
    name: s._id,
    count: s.count,
  })) || [];

  return (
    <DashboardLayout sidebarLinks={adminSidebarLinks}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
          <p className="text-gray-600">Detailed platform insights</p>
        </div>

        {/* Sector Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Job Distribution by Sector</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Status */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1E3A5F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    +{analyticsData?.users.newLast30Days || 0}
                  </p>
                  <p className="text-sm text-gray-600">New users (30 days)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    +{analyticsData?.jobs.newLast30Days || 0}
                  </p>
                  <p className="text-sm text-gray-600">New jobs (30 days)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    +{analyticsData?.applications.newLast30Days || 0}
                  </p>
                  <p className="text-sm text-gray-600">New applications (30 days)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
