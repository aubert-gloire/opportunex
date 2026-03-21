import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, Users, BarChart3, TrendingUp } from 'lucide-react';
import { adminAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const adminSidebarLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/admin/users', label: 'Manage Users', icon: <Users className="w-4 h-4" /> },
  { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
];

const COLORS = ['#1E3A5F', '#4F7CAC', '#6B9E78', '#C4A46B', '#9B8EC4'];

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

  if (isLoading) return <div className="text-stone-400 text-sm">Loading analytics...</div>;

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
        <div className="border-b border-stone-100 pb-8 mb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Administration</p>
          <h1 className="font-display font-light text-stone-900 text-3xl sm:text-4xl" style={{ letterSpacing: '-0.022em' }}>Analytics & Reports</h1>
          <p className="text-stone-400 text-sm mt-2">Detailed platform insights</p>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-stone-100">
            <p className="text-[10px] uppercase tracking-label text-stone-400 mb-2.5">User Growth</p>
            <div className="font-display font-light text-stone-900 text-3xl mb-1" style={{ letterSpacing: '-0.022em' }}>
              +{analyticsData?.users.newLast30Days || 0}
            </div>
            <p className="text-sm text-stone-400">New users (30 days)</p>
          </div>

          <div className="p-6 border border-stone-100">
            <p className="text-[10px] uppercase tracking-label text-stone-400 mb-2.5">Job Growth</p>
            <div className="font-display font-light text-stone-900 text-3xl mb-1" style={{ letterSpacing: '-0.022em' }}>
              +{analyticsData?.jobs.newLast30Days || 0}
            </div>
            <p className="text-sm text-stone-400">New jobs (30 days)</p>
          </div>

          <div className="p-6 border border-stone-100">
            <p className="text-[10px] uppercase tracking-label text-stone-400 mb-2.5">Application Growth</p>
            <div className="font-display font-light text-stone-900 text-3xl mb-1" style={{ letterSpacing: '-0.022em' }}>
              +{analyticsData?.applications.newLast30Days || 0}
            </div>
            <p className="text-sm text-stone-400">New applications (30 days)</p>
          </div>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#78716c' }} />
                <YAxis tick={{ fontSize: 12, fill: '#78716c' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1E3A5F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
