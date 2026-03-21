import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  CheckCircle2,
  Circle,
  XCircle,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { applicationAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { formatDate, statusColors } from '@/utils/helpers';
import { APPLICATION_STATUSES } from '@/utils/constants';

const youthSidebarLinks = [
  { path: '/youth/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/youth/jobs', label: 'Find Jobs', icon: <Briefcase className="w-4 h-4" /> },
  { path: '/youth/applications', label: 'My Applications', icon: <FileText className="w-4 h-4" /> },
  { path: '/youth/mentorship', label: 'Mentorship', icon: <Users className="w-4 h-4" /> },
  { path: '/youth/skill-tests', label: 'Skill Tests', icon: <GraduationCap className="w-4 h-4" /> },
  { path: '/youth/profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
];

const APP_STEPS = ['pending', 'reviewed', 'shortlisted', 'interview', 'accepted'];

const StatusStepper = ({ status }) => {
  const rejected = status === 'rejected' || status === 'withdrawn';
  const currentIdx = rejected ? -1 : APP_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-0 mt-3">
      {APP_STEPS.map((step, i) => {
        const done = !rejected && i <= currentIdx;
        const active = !rejected && i === currentIdx;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-5 h-5 flex items-center justify-center transition-colors ${
                done ? 'text-[#1E3A5F]' : 'text-stone-200'
              }`}>
                {done ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              </div>
              <span className={`text-[8px] uppercase tracking-wide mt-0.5 hidden sm:block ${active ? 'text-[#1E3A5F]' : 'text-stone-300'}`}>
                {step}
              </span>
            </div>
            {i < APP_STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 mb-4 ${i < currentIdx && !rejected ? 'bg-[#1E3A5F]/30' : 'bg-stone-100'}`} />
            )}
          </div>
        );
      })}
      {rejected && (
        <div className="flex items-center gap-1 ml-2">
          <XCircle className="w-4 h-4 text-[#B5665E]" />
          <span className="text-[8px] uppercase tracking-wide text-[#B5665E]">{status}</span>
        </div>
      )}
    </div>
  );
};

const MyApplications = () => {
  const [statusFilter, setStatusFilter] = useState('');

  const queryClient = useQueryClient();

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

  const withdrawMutation = useMutation({
    mutationFn: (id) => applicationAPI.withdrawApplication(id),
    onSuccess: () => {
      toast.success('Application withdrawn');
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
    onError: () => toast.error('Could not withdraw application'),
  });

  return (
    <DashboardLayout sidebarLinks={youthSidebarLinks}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="border-b border-stone-100 pb-8 mb-8 flex-1">
            <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Career</p>
            <h1 className="font-display font-light text-stone-900 text-3xl sm:text-4xl" style={{ letterSpacing: '-0.022em' }}>My Applications</h1>
            <p className="text-stone-400 text-sm mt-2">Track your job applications</p>
          </div>
          <Link to="/youth/jobs" className="ml-4">
            <Button variant="accent">
              Find More Jobs
            </Button>
          </Link>
        </div>

        {/* Filter */}
        <Card>
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-label text-stone-400">Filter by status:</span>
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
                          className="w-12 h-12 object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-stone-100 flex items-center justify-center text-stone-600 font-light text-lg">
                          C
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <Link to={`/jobs/${application.job._id}`}>
                          <h3 className="text-lg font-light text-stone-900 hover:text-primary transition-colors" style={{ letterSpacing: '-0.01em' }}>
                            {application.job.title}
                          </h3>
                        </Link>
                        <p className="text-stone-400 text-sm flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {application.job.employer.firstName} {application.job.employer.lastName}
                        </p>
                        <p className="text-stone-400 text-xs mt-1 flex items-center gap-1">
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
                    <div className="bg-stone-50 p-3">
                      <p className="text-sm text-stone-500 line-clamp-2">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}

                  {/* Application progress stepper */}
                  <StatusStepper status={application.status} />

                  {/* Interview Details */}
                  {application.interviewDate && (
                    <div className="border-l-2 border-[#6B9E78] bg-stone-50 pl-3 py-2">
                      <p className="text-xs uppercase tracking-label text-[#6B9E78] mb-1">Interview Scheduled</p>
                      <p className="text-sm text-stone-700">
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
                    <div className="bg-stone-50 border border-stone-100 p-3">
                      <p className="text-sm font-medium text-stone-900 mb-1">Employer Notes</p>
                      <p className="text-sm text-stone-500">{application.employerNotes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {(application.status === 'pending' || application.status === 'reviewed') && (
                    <div className="pt-2 border-t border-stone-50 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-stone-400 hover:text-[#B5665E]"
                        onClick={() => withdrawMutation.mutate(application._id)}
                        loading={withdrawMutation.isPending}
                      >
                        Withdraw Application
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyApplications;
