import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Building2,
  CreditCard,
  TrendingUp,
  Eye,
} from 'lucide-react';
import { jobAPI, applicationAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate, statusColors } from '@/utils/helpers';

const employerSidebarLinks = [
  { path: '/employer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/employer/post-job', label: 'Post a Job', icon: <Briefcase className="w-5 h-5" /> },
  { path: '/employer/my-postings', label: 'My Postings', icon: <FileText className="w-5 h-5" /> },
  { path: '/employer/talent-search', label: 'Search Talent', icon: <Users className="w-5 h-5" /> },
  { path: '/employer/subscription', label: 'Subscription', icon: <CreditCard className="w-5 h-5" /> },
  { path: '/employer/profile', label: 'Company Profile', icon: <Building2 className="w-5 h-5" /> },
];

const EmployerDashboard = () => {
  const { data: postingsData } = useQuery({
    queryKey: ['myPostings'],
    queryFn: async () => {
      const response = await jobAPI.getMyPostings({ limit: 5 });
      return response.data;
    },
  });

  const stats = {
    activeJobs: postingsData?.jobs.filter((j) => j.status === 'open').length || 0,
    totalApplications: postingsData?.jobs.reduce((sum, j) => sum + j.applicationsCount, 0) || 0,
    totalViews: postingsData?.jobs.reduce((sum, j) => sum + j.views, 0) || 0,
  };

  return (
    <DashboardLayout sidebarLinks={employerSidebarLinks}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
          <p className="text-gray-600">Manage your job postings and find talent</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 text-sm mb-1">Active Jobs</p>
                <p className="text-3xl font-bold">{stats.activeJobs}</p>
              </div>
              <Briefcase className="w-8 h-8 opacity-80" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
              <FileText className="w-8 h-8 text-accent" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
              <Eye className="w-8 h-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/employer/post-job">
                <Button variant="accent" className="w-full">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Post Job
                </Button>
              </Link>
              <Link to="/employer/talent-search">
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Find Talent
                </Button>
              </Link>
              <Link to="/employer/my-postings">
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  View Postings
                </Button>
              </Link>
              <Link to="/employer/profile">
                <Button variant="outline" className="w-full">
                  <Building2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Job Postings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Job Postings</CardTitle>
              <Link to="/employer/my-postings">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {postingsData?.jobs && postingsData.jobs.length > 0 ? (
              <div className="space-y-3">
                {postingsData.jobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition-all"
                  >
                    <div className="flex-1">
                      <Link to={`/jobs/${job._id}`}>
                        <h4 className="font-semibold text-gray-900 hover:text-primary transition-colors">
                          {job.title}
                        </h4>
                      </Link>
                      <p className="text-sm text-gray-600">
                        Posted {formatDate(job.createdAt)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="gray" className={statusColors[job.status]}>
                          {job.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {job.applicationsCount} applications
                        </span>
                        <span className="text-xs text-gray-500">
                          {job.views} views
                        </span>
                      </div>
                    </div>
                    {job.status === 'open' && (
                      <Link to={`/employer/applications/${job._id}`}>
                        <Button variant="primary" size="sm">
                          View Applications
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">
                No job postings yet. Create your first posting!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
