import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Briefcase,
  FileText,
  DollarSign,
  TrendingUp,
  Award,
} from 'lucide-react';
import { adminAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/helpers';

const adminSidebarLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/admin/users', label: 'Manage Users', icon: <Users className="w-5 h-5" /> },
  { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
];

const AdminDashboard = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await adminAPI.getAnalytics();
      return response.data.analytics;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const stats = analyticsData;

  return (
    <DashboardLayout sidebarLinks={adminSidebarLinks}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and statistics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold">{stats?.users.total || 0}</p>
                <p className="text-xs text-gray-200 mt-1">
                  +{stats?.users.newLast30Days || 0} this month
                </p>
              </div>
              <Users className="w-8 h-8 opacity-80" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.jobs.active || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.jobs.total || 0} total
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-accent" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Applications</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.applications.total || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.applications.pending || 0} pending
                </p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats?.revenue.total || 0)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(stats?.revenue.thisMonth || 0)} this month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Youth</span>
                  <span className="font-semibold text-gray-900">{stats?.users.youth || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Employers</span>
                  <span className="font-semibold text-gray-900">{stats?.users.employers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Verified Employers</span>
                  <span className="font-semibold text-gray-900">
                    {stats?.users.verifiedEmployers || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Sectors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.topSectors.slice(0, 5).map((sector, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-700 text-sm">{sector.sector || 'Other'}</span>
                    <span className="font-semibold text-gray-900">{sector.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Universities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats?.topUniversities.slice(0, 5).map((uni, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-700 text-sm">{uni.university || 'Other'}</span>
                    <span className="font-semibold text-gray-900">{uni.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Mentorship & Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.mentorship.total || 0}
                  </p>
                  <p className="text-sm text-gray-600">Mentorship Sessions</p>
                  <p className="text-xs text-gray-500">
                    {stats?.mentorship.completed || 0} completed
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.skillTests.total || 0}
                  </p>
                  <p className="text-sm text-gray-600">Active Skill Tests</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
