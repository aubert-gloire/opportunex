import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, FileText, Building2, CreditCard } from 'lucide-react';
import { jobAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate, statusColors } from '@/utils/helpers';

const employerSidebarLinks = [
  { path: '/employer/dashboard',    label: 'Dashboard',       icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/employer/post-job',     label: 'Post a Job',      icon: <Briefcase className="w-4 h-4" /> },
  { path: '/employer/my-postings',  label: 'My Postings',     icon: <FileText className="w-4 h-4" /> },
  { path: '/employer/talent-search',label: 'Search Talent',   icon: <Users className="w-4 h-4" /> },
  { path: '/employer/subscription', label: 'Subscription',    icon: <CreditCard className="w-4 h-4" /> },
  { path: '/employer/profile',      label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
];

const EmployerDashboard = () => {
  const { data: postingsData } = useQuery({
    queryKey: ['myPostings'],
    queryFn: async () => (await jobAPI.getMyPostings({ limit: 5 })).data,
  });

  const activeJobs        = postingsData?.jobs.filter((j) => j.status === 'open').length || 0;
  const totalApplications = postingsData?.jobs.reduce((s, j) => s + j.applicationsCount, 0) || 0;
  const totalViews        = postingsData?.jobs.reduce((s, j) => s + j.views, 0) || 0;

  const stats = [
    { label: 'Active Jobs',   value: activeJobs,        sub: 'open postings'   },
    { label: 'Applications',  value: totalApplications, sub: 'total received'  },
    { label: 'Total Views',   value: totalViews,        sub: 'across postings' },
  ];

  return (
    <DashboardLayout sidebarLinks={employerSidebarLinks}>
      <div className="space-y-8">

        {/* Header */}
        <div className="border-b border-stone-100 pb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Employer Dashboard</p>
          <h1 className="font-display font-light text-stone-900 text-4xl" style={{ letterSpacing: '-0.022em' }}>
            Manage Your <em>Talent Pipeline</em>
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-stone-100 divide-x divide-stone-100">
          {stats.map(({ label, value, sub }) => (
            <div key={label} className="p-6">
              <div className="font-display text-3xl font-light text-stone-900" style={{ letterSpacing: '-0.02em' }}>{value}</div>
              <div className="text-[10px] uppercase tracking-label text-stone-400 mt-1">{label}</div>
              <div className="text-[10px] text-stone-300 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/employer/post-job',     label: 'Post Job'      },
            { to: '/employer/talent-search',label: 'Find Talent'   },
            { to: '/employer/my-postings',  label: 'View Postings' },
            { to: '/employer/profile',      label: 'Edit Profile'  },
          ].map(({ to, label }) => (
            <Link key={to} to={to}>
              <Button variant="outline" className="w-full">{label}</Button>
            </Link>
          ))}
        </div>

        {/* Recent postings */}
        <Card padding={false}>
          <CardHeader className="px-6 pt-6 pb-4 border-b border-stone-100 flex items-center justify-between">
            <CardTitle>Recent Postings</CardTitle>
            <Link to="/employer/my-postings">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {postingsData?.jobs && postingsData.jobs.length > 0 ? (
              <div>
                {postingsData.jobs.map((job) => (
                  <div key={job._id} className="flex items-center justify-between px-6 py-4 border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <div>
                      <Link to={`/jobs/${job._id}`}>
                        <p className="text-sm font-medium text-stone-900 hover:text-primary transition-colors">{job.title}</p>
                      </Link>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-stone-400">{formatDate(job.createdAt)}</span>
                        <Badge variant="gray" className={statusColors[job.status]}>{job.status}</Badge>
                        <span className="text-[10px] text-stone-400">{job.applicationsCount} applications · {job.views} views</span>
                      </div>
                    </div>
                    {job.status === 'open' && (
                      <Link to={`/employer/applications/${job._id}`}>
                        <Button variant="outline" size="sm">Applications</Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-400 text-center py-10 px-6">
                No postings yet.{' '}
                <Link to="/employer/post-job" className="text-primary underline-offset-2 hover:underline">
                  Create your first job
                </Link>.
              </p>
            )}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
