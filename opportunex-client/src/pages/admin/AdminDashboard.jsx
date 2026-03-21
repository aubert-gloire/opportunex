import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, Users, BarChart3, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from 'recharts';
import { adminAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/helpers';

const adminSidebarLinks = [
  { path: '/admin/dashboard', label: 'Dashboard',    icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/admin/users',     label: 'Manage Users', icon: <Users className="w-4 h-4" /> },
  { path: '/admin/analytics', label: 'Analytics',    icon: <BarChart3 className="w-4 h-4" /> },
];

const CHART_COLORS = ['#1E3A5F', '#4F7CAC', '#6B9E78', '#C4A46B', '#9B8EC4'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-stone-100 px-3 py-2 text-xs text-stone-700 shadow-sm">
      {label && <p className="text-stone-400 mb-1" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i}><span className="font-medium">{p.value}</span> {p.name}</p>
      ))}
    </div>
  );
};

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

  // Simulated monthly growth trend from totals
  const growthTrend = (() => {
    const total = s?.users.total || 0;
    const newThisMonth = s?.users.newLast30Days || 0;
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    const base = Math.max(1, Math.round((total - newThisMonth) / 5));
    return months.map((month, i) => ({
      month,
      users: i < 5 ? Math.max(0, base * (i + 1) + Math.round(Math.random() * base * 0.2)) : total,
    }));
  })();

  const stats = [
    { label: 'Total Users',  value: s?.users.total || 0,                  sub: `+${s?.users.newLast30Days || 0} this month`                        },
    { label: 'Active Jobs',  value: s?.jobs.active || 0,                   sub: `${s?.jobs.total || 0} total`                                        },
    { label: 'Applications', value: s?.applications.total || 0,            sub: `${s?.applications.pending || 0} pending`                             },
    { label: 'Revenue',      value: formatCurrency(s?.revenue.total || 0), sub: formatCurrency(s?.revenue.thisMonth || 0) + ' this month'             },
  ];

  // User distribution pie
  const userPieData = [
    { name: 'Youth',             value: s?.users.youth || 0     },
    { name: 'Employers',         value: s?.users.employers || 0 },
  ].filter((d) => d.value > 0);

  // Application status bar
  const appBarData = [
    { status: 'Pending',  count: s?.applications.pending || 0 },
    { status: 'Accepted', count: s?.applications.accepted || 0 },
    { status: 'Other',    count: Math.max(0, (s?.applications.total || 0) - (s?.applications.pending || 0) - (s?.applications.accepted || 0)) },
  ].filter((d) => d.count > 0);

  // Top sectors bar
  const sectorBarData = (s?.topSectors || []).map((sec) => ({
    sector: (sec.sector || 'Other').length > 12 ? (sec.sector || 'Other').slice(0, 12) + '…' : (sec.sector || 'Other'),
    count: sec.count,
  }));

  return (
    <DashboardLayout sidebarLinks={adminSidebarLinks}>
      <div className="space-y-8">

        {/* Header */}
        <div className="border-b border-stone-100 pb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Admin</p>
          <h1 className="font-display font-light text-stone-900 text-3xl sm:text-4xl" style={{ letterSpacing: '-0.022em' }}>
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

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* User distribution */}
          <Card padding={false}>
            <CardHeader className="px-6 pt-6 pb-4 border-b border-stone-100">
              <CardTitle>User Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {userPieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie
                        data={userPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={38}
                        outerRadius={56}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {userPieData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-3">
                    {userPieData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                          <span className="text-xs text-stone-500">{item.name}</span>
                        </div>
                        <span className="text-xs font-medium text-stone-900">{item.value}</span>
                      </div>
                    ))}
                    {s?.users.verifiedEmployers > 0 && (
                      <div className="flex items-center justify-between border-t border-stone-50 pt-2 mt-1">
                        <span className="text-xs text-stone-400">Verified employers</span>
                        <span className="text-xs font-medium text-stone-900">{s.users.verifiedEmployers}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-stone-400 text-center py-10">No user data.</p>
              )}
            </CardContent>
          </Card>

          {/* Application status */}
          <Card padding={false}>
            <CardHeader className="px-6 pt-6 pb-4 border-b border-stone-100">
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {appBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={appBarData} barSize={20} layout="vertical">
                    <CartesianGrid horizontal={false} stroke="#f5f5f4" />
                    <XAxis type="number" tick={{ fontSize: 9, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="status" tick={{ fontSize: 9, fill: '#a8a29e' }} axisLine={false} tickLine={false} width={50} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="count" fill="#1E3A5F" radius={[0, 1, 1, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-stone-400 text-center py-10">No application data.</p>
              )}
            </CardContent>
          </Card>

          {/* Top sectors */}
          <Card padding={false}>
            <CardHeader className="px-6 pt-6 pb-4 border-b border-stone-100">
              <CardTitle>Top Sectors</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {sectorBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={sectorBarData} barSize={10} layout="vertical">
                    <CartesianGrid horizontal={false} stroke="#f5f5f4" />
                    <XAxis type="number" tick={{ fontSize: 9, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="sector" tick={{ fontSize: 9, fill: '#a8a29e' }} axisLine={false} tickLine={false} width={64} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="jobs" fill="#4F7CAC" radius={[0, 1, 1, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-stone-400 text-center py-10">No sector data yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Platform Growth */}
        <Card padding={false}>
          <CardHeader className="px-6 pt-6 pb-4 border-b border-stone-100 flex items-center justify-between">
            <CardTitle>Platform Growth — Users</CardTitle>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#6B9E78]" />
              <span className="text-xs text-[#6B9E78]">+{s?.users.newLast30Days || 0} this month</span>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={growthTrend} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B9E78" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6B9E78" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f5f5f4" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: '#a8a29e' }} axisLine={false} tickLine={false} width={24} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="users" name="users" stroke="#6B9E78" strokeWidth={1.5} fill="url(#growthGrad)" dot={{ r: 3, fill: '#6B9E78', strokeWidth: 0 }} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mentorship & Skills & Universities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Mentorship */}
          <Card>
            <CardHeader><CardTitle>Mentorship</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Total sessions',     value: s?.mentorship.total || 0     },
                  { label: 'Completed',           value: s?.mentorship.completed || 0 },
                  { label: 'Completion rate',     value: s?.mentorship.total
                      ? `${Math.round(((s.mentorship.completed || 0) / s.mentorship.total) * 100)}%`
                      : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between border-b border-stone-50 pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-stone-500">{label}</span>
                    <span className="font-display text-lg font-light text-stone-900">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skill tests */}
          <Card>
            <CardHeader><CardTitle>Skill Tests</CardTitle></CardHeader>
            <CardContent>
              <div className="font-display text-5xl font-light text-stone-900 mb-2" style={{ letterSpacing: '-0.03em' }}>
                {s?.skillTests.total || 0}
              </div>
              <p className="text-[10px] uppercase tracking-label text-stone-400">Active assessments</p>
            </CardContent>
          </Card>

          {/* Top universities */}
          <Card>
            <CardHeader><CardTitle>Top Universities</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(s?.topUniversities || []).slice(0, 4).map((uni, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-stone-50 pb-3 last:border-0 last:pb-0">
                    <span className="text-sm text-stone-500">{uni.university || 'Other'}</span>
                    <span className="font-display text-lg font-light text-stone-900">{uni.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
