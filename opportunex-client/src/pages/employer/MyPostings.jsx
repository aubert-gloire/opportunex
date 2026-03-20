import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Building2,
  CreditCard,
  Eye,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { jobAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, statusColors } from '@/utils/helpers';

const employerSidebarLinks = [
  { path: '/employer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/employer/post-job', label: 'Post a Job', icon: <Briefcase className="w-4 h-4" /> },
  { path: '/employer/my-postings', label: 'My Postings', icon: <FileText className="w-4 h-4" /> },
  { path: '/employer/talent-search', label: 'Search Talent', icon: <Users className="w-4 h-4" /> },
  { path: '/employer/subscription', label: 'Subscription', icon: <CreditCard className="w-4 h-4" /> },
  { path: '/employer/profile', label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
];

const MyPostings = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');

  const { data: postingsData, isLoading, refetch } = useQuery({
    queryKey: ['myPostings', statusFilter],
    queryFn: async () => {
      const response = await jobAPI.getMyPostings({ status: statusFilter });
      return response.data;
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id) => jobAPI.deleteJob(id),
    onSuccess: () => {
      toast.success('Job deleted successfully');
      refetch();
    },
    onError: () => {
      toast.error('Failed to delete job');
    },
  });

  const handleDelete = (job) => {
    if (window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      deleteJobMutation.mutate(job._id);
    }
  };

  return (
    <DashboardLayout sidebarLinks={employerSidebarLinks}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="border-b border-stone-100 pb-8 mb-8 flex-1">
            <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Recruiting</p>
            <h1 className="font-display font-light text-stone-900 text-4xl" style={{ letterSpacing: '-0.022em' }}>My Job Postings</h1>
            <p className="text-stone-400 text-sm mt-2">Manage your job listings</p>
          </div>
          <Link to="/employer/post-job" className="ml-4">
            <Button variant="accent">
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Filter */}
        <Card>
          <Select
            label="Filter by Status"
            options={[
              { value: '', label: 'All Jobs' },
              { value: 'open', label: 'Open' },
              { value: 'closed', label: 'Closed' },
              { value: 'filled', label: 'Filled' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="max-w-xs"
          />
        </Card>

        {/* Job Postings */}
        {isLoading ? (
          <p className="text-stone-400 text-sm">Loading postings...</p>
        ) : postingsData?.jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No job postings yet"
            description="Create your first job posting to start finding talent"
            action={
              <Link to="/employer/post-job">
                <Button variant="primary">Post a Job</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {postingsData?.jobs.map((job) => (
              <Card key={job._id} hover>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link to={`/jobs/${job._id}`}>
                        <h3 className="font-light text-stone-900 text-xl hover:text-primary transition-colors mb-2" style={{ letterSpacing: '-0.01em' }}>
                          {job.title}
                        </h3>
                      </Link>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="gray" className={statusColors[job.status]}>
                          {job.status}
                        </Badge>
                        <Badge variant="primary">{job.type}</Badge>
                        {job.sector && <Badge variant="gray">{job.sector}</Badge>}
                      </div>
                      <p className="text-sm text-stone-400">
                        Posted {formatDate(job.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm text-stone-400">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {job.applicationsCount} applications
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {job.views} views
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-stone-50">
                    {job.status === 'open' && (
                      <Link to={`/employer/applications/${job._id}`} className="flex-1">
                        <Button variant="primary" className="w-full">
                          View Applications ({job.applicationsCount})
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/employer/edit-job/${job._id}`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(job)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyPostings;
