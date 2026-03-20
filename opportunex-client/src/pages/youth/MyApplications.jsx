import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  GraduationCap,
  User,
  Building2,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { applicationAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { formatDate, statusColors } from '@/utils/helpers';
import { APPLICATION_STATUSES } from '@/utils/constants';

const youthSidebarLinks = [
  { path: '/youth/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/youth/jobs', label: 'Find Jobs', icon: <Briefcase className="w-5 h-5" /> },
  { path: '/youth/applications', label: 'My Applications', icon: <FileText className="w-5 h-5" /> },
  { path: '/youth/mentorship', label: 'Mentorship', icon: <Users className="w-5 h-5" /> },
  { path: '/youth/skill-tests', label: 'Skill Tests', icon: <GraduationCap className="w-5 h-5" /> },
  { path: '/youth/profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
];

const MyApplications = () => {
  const [statusFilter, setStatusFilter] = useState('');

  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ['myApplications', statusFilter],
    queryFn: async () => {
      const response = await applicationAPI.getMyApplications({
        status: statusFilter,
        limit: 50,
      });
      return response.data;
    },
  });

  return (
    <DashboardLayout sidebarLinks={youthSidebarLinks}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-gray-600">Track your job applications</p>
          </div>
          <Link to="/youth/jobs">
            <Button variant="accent">
              <Briefcase className="w-4 h-4 mr-2" />
              Find More Jobs
            </Button>
          </Link>
        </div>

        {/* Filter */}
        <Card>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <Select
              options={[
                { value: '', label: 'All Applications' },
                ...APPLICATION_STATUSES.map((s) => ({ value: s.value, label: s.label })),
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="max-w-xs"
            />
          </div>
        </Card>

        {/* Applications List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : applicationsData?.applications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Start applying to jobs to see them here"
            action={
              <Link to="/youth/jobs">
                <Button variant="primary">Browse Jobs</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {applicationsData?.applications.map((application) => (
              <Card key={application._id} hover>
                <div className="space-y-4">
                  {/* Job Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {application.job.employer.avatar ? (
                        <img
                          src={application.job.employer.avatar}
                          alt="Company"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">
                          C
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link to={`/jobs/${application.job._id}`}>
                          <h3 className="text-lg font-bold text-gray-900 hover:text-primary transition-colors">
                            {application.job.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {application.job.employer.firstName} {application.job.employer.lastName}
                        </p>
                        <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Applied on {formatDate(application.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="gray" className={statusColors[application.status]}>
                      {application.status}
                    </Badge>
                  </div>

                  {/* Cover Letter Preview */}
                  {application.coverLetter && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}

                  {/* Interview Details */}
                  {application.interviewDate && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-900 mb-1">
                        Interview Scheduled
                      </p>
                      <p className="text-sm text-green-700">
                        {formatDate(application.interviewDate)}
                      </p>
                      {application.interviewDetails?.meetingLink && (
                        <a
                          href={application.interviewDetails.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                        >
                          Join Meeting
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Employer Notes */}
                  {application.employerNotes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-900 mb-1">Employer Notes</p>
                      <p className="text-sm text-blue-700">{application.employerNotes}</p>
                    </div>
                  )}
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
          title="Submit Application"
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
                rows={10}
                placeholder="Explain why you're a great fit for this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default MyApplications;
