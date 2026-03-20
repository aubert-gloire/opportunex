import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, Users, BarChart3 } from 'lucide-react';
import { adminAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/helpers';

const adminSidebarLinks = [
  { path: '/admin/dashboard', label: 'Dashboard',    icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/admin/users',     label: 'Manage Users', icon: <Users className="w-4 h-4" /> },
  { path: '/admin/analytics', label: 'Analytics',    icon: <BarChart3 className="w-4 h-4" /> },
];

const AdminDashboard = () => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => (await adminAPI.getAnalytics()).data.analytics,
  });

  if (isLoading) return (
    <DashboardLayout sidebarLinks={adminSidebarLinks}>
      <div className="text-stone-300 text-sm py-20 text-center">Loading…</div>
    </DashboardLayout>
  );

  const s = analyticsData;

  const stats = [
    { label: 'Total Users',   value: s?.users.total || 0,               sub: `+${s?.users.newLast30Days || 0} this month` },
    { label: 'Active Jobs',   value: s?.jobs.active || 0,               sub: `${s?.jobs.total || 0} total`                },
    { label: 'Applications',  value: s?.applications.total || 0,        sub: `${s?.applications.pending || 0} pending`    },
    { label: 'Revenue',       value: formatCurrency(s?.revenue.total || 0), sub: formatCurrency(s?.revenue.thisMonth || 0) + ' this month' },
  ];

  return (
    <DashboardLayout sidebarLinks={adminSidebarLinks}>
      <div className="space-y-8">

        {/* Header */}
        <div className="border-b border-stone-100 pb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Admin</p>
          <h1 className="font-display font-light text-stone-900 text-4xl" style={{ letterSpacing: '-0.022em' }}>
            Platform <em>Overview</em>
          </h1>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-stone-100 divide-x divide-y md:divide-y-0 divide-stone-100">
          {stats.map(({ label, value, sub }) => (
            <div key={label} className="p-6">
              <div className="font-display text-3xl font-light text-stone-900" style={{ letterSpacing: '-0.02em' }}>{value}</div>
              <div className="text-[10px] uppercase tracking-label text-stone-400 mt-1">{label}</div>
              <div className="text-[10px] text-stone-300 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* User & sector distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card>
            <CardHeader><CardTitle>User Distribution</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Youth',              value: s?.users.youth || 0              },
                  { label: 'Employers',           value: s?.users.employers || 0          },
                  { label: 'Verified Employers',  value: s?.users.verifiedEmployers || 0  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between border-b border-stone-50 pb-4 last:border-0 last:pb-0">
                    <span className="text-sm text-stone-500">{label}</span>
                    <span className="font-display text-lg font-light text-stone-900">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Top Sectors</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {s?.topSectors.slice(0, 5).map((sector, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-stone-50 pb-4 last:border-0 last:pb-0">
                    <span className="text-sm text-stone-500">{sector.sector || 'Other'}</span>
                    <span className="font-display text-lg font-light text-stone-900">{sector.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Top Universities</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {s?.topUniversities.slice(0, 5).map((uni, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-stone-50 pb-4 last:border-0 last:pb-0">
                    <span className="text-sm text-stone-500">{uni.university || 'Other'}</span>
                    <span className="font-display text-lg font-light text-stone-900">{uni.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Mentorship & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-stone-100 divide-x divide-stone-100">
          <div className="p-6">
            <div className="font-display text-3xl font-light text-stone-900">{s?.mentorship.total || 0}</div>
            <div className="text-[10px] uppercase tracking-label text-stone-400 mt-1">Mentorship Sessions</div>
            <div className="text-[10px] text-stone-300 mt-0.5">{s?.mentorship.completed || 0} completed</div>
          </div>
          <div className="p-6">
            <div className="font-display text-3xl font-light text-stone-900">{s?.skillTests.total || 0}</div>
            <div className="text-[10px] uppercase tracking-label text-stone-400 mt-1">Active Skill Tests</div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
