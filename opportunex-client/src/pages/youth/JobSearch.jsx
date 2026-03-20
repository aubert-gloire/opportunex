import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  GraduationCap,
  User,
  Search,
  MapPin,
  Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { jobAPI, applicationAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import Badge from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, formatCurrency, sectorIcons } from '@/utils/helpers';
import { SECTORS, JOB_TYPES } from '@/utils/constants';

const youthSidebarLinks = [
  { path: '/youth/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/youth/jobs', label: 'Find Jobs', icon: <Briefcase className="w-5 h-5" /> },
  { path: '/youth/applications', label: 'My Applications', icon: <FileText className="w-5 h-5" /> },
  { path: '/youth/mentorship', label: 'Mentorship', icon: <Users className="w-5 h-5" /> },
  { path: '/youth/skill-tests', label: 'Skill Tests', icon: <GraduationCap className="w-5 h-5" /> },
  { path: '/youth/profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
];

const JobSearch = () => {
  const location = useLocation();
  const [filters, setFilters] = useState({
    search: '',
    sector: '',
    type: '',
    location: '',
  });
  const [selectedJob, setSelectedJob] = useState(location.state?.applyToJob || null);
  const [showApplyModal, setShowApplyModal] = useState(!!location.state?.applyToJob);
  const [coverLetter, setCoverLetter] = useState('');

  const { data: jobsData, isLoading, refetch } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const response = await jobAPI.getJobs(filters);
      return response.data;
    },
  });

  const applyMutation = useMutation({
    mutationFn: (data) => applicationAPI.applyToJob(data),
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setCoverLetter('');
      setSelectedJob(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    },
  });

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleSubmitApplication = () => {
    if (!selectedJob) return;

    applyMutation.mutate({
      job: selectedJob._id,
      coverLetter,
    });
  };

  const handleSearch = () => {
    refetch();
  };

  return (
    <DashboardLayout sidebarLinks={youthSidebarLinks}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Jobs</h1>
          <p className="text-gray-600">Discover opportunities that match your skills</p>
        </div>

        {/* Search and Filters */}
        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search jobs..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
              <Select
                placeholder="All Sectors"
                options={SECTORS}
                value={filters.sector}
                onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
              />
              <Select
                placeholder="Job Type"
                options={JOB_TYPES}
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              />
            </div>
            <div className="flex gap-4">
              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="flex-1"
              />
              <Button variant="primary" onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : jobsData?.jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No jobs found"
            description="Try adjusting your filters"
          />
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Showing {jobsData?.jobs.length} of {jobsData?.count} opportunities
            </div>
            {jobsData?.jobs.map((job) => (
              <Card key={job._id} hover>
                <div className="flex gap-4">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.companyName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-xl">
                        {job.companyName?.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/jobs/${job._id}`}>
                      <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {job.companyName}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="primary">{job.type}</Badge>
                      {job.sector && (
                        <Badge variant="gray">
                          {sectorIcons[job.sector]} {job.sector}
                        </Badge>
                      )}
                      <Badge variant="gray">
                        <MapPin className="w-3 h-3 mr-1" />
                        {job.location}
                      </Badge>
                      {job.isRemote && <Badge variant="success">Remote</Badge>}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Posted {formatDate(job.createdAt)}
                      </span>
                      <Button variant="accent" size="sm" onClick={() => handleApply(job)}>
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Apply Modal */}
        <Modal
          isOpen={showApplyModal}
          onClose={() => {
            setShowApplyModal(false);
            setSelectedJob(null);
            setCoverLetter('');
          }}
          title="Apply for Position"
          size="lg"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowApplyModal(false);
                  setSelectedJob(null);
                  setCoverLetter('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitApplication}
                loading={applyMutation.isPending}
              >
                Submit Application
              </Button>
            </>
          }
        >
          {selectedJob && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedJob.title}</h3>
                <p className="text-gray-600">{selectedJob.companyName}</p>
              </div>

              <Textarea
                label="Cover Letter"
                rows={8}
                placeholder="Tell the employer why you're a great fit for this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  Your CV from your profile will be automatically attached. Make sure your profile is up to date!
                </p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default JobSearch;
