import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Building2,
  CreditCard,
  Mail,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { applicationAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, statusColors } from '@/utils/helpers';
import { APPLICATION_STATUSES } from '@/utils/constants';
import toast from 'react-hot-toast';

const employerSidebarLinks = [
  { path: '/employer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/employer/post-job', label: 'Post a Job', icon: <Briefcase className="w-4 h-4" /> },
  { path: '/employer/my-postings', label: 'My Postings', icon: <FileText className="w-4 h-4" /> },
  { path: '/employer/talent-search', label: 'Search Talent', icon: <Users className="w-4 h-4" /> },
  { path: '/employer/subscription', label: 'Subscription', icon: <CreditCard className="w-4 h-4" /> },
  { path: '/employer/profile', label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
];

const ViewApplications = () => {
  const { jobId } = useParams();
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [employerNotes, setEmployerNotes] = useState('');

  const { data: applicationsData, isLoading, refetch } = useQuery({
    queryKey: ['jobApplications', jobId, statusFilter],
    queryFn: async () => {
      const response = await applicationAPI.getJobApplications(jobId, { status: statusFilter });
      return response.data;
    },
  });

  const handleViewDetails = (application) => {
    setSelectedApp(application);
    setNewStatus(application.status);
    setEmployerNotes(application.employerNotes || '');
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await applicationAPI.updateApplicationStatus(selectedApp._id, {
        status: newStatus,
        employerNotes,
      });
      toast.success('Application updated successfully');
      setShowDetailModal(false);
      refetch();
    } catch (error) {
      toast.error('Failed to update application');
    }
  };

  return (
    <DashboardLayout sidebarLinks={employerSidebarLinks}>
      <div className="space-y-6">
        <div className="border-b border-stone-100 pb-8 mb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Recruiting</p>
          <h1 className="font-display font-light text-stone-900 text-4xl" style={{ letterSpacing: '-0.022em' }}>Applications</h1>
          <p className="text-stone-400 text-sm mt-2">Review and manage applicants</p>
        </div>

        {/* Filter */}
        <Card>
          <Select
            label="Filter by Status"
            options={[
              { value: '', label: 'All Applications' },
              ...APPLICATION_STATUSES.map((s) => ({ value: s.value, label: s.label })),
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="max-w-xs"
          />
        </Card>

        {/* Applications List */}
        {isLoading ? (
          <p className="text-stone-400 text-sm">Loading applications...</p>
        ) : applicationsData?.applications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Applications will appear here once candidates start applying"
          />
        ) : (
          <div className="space-y-4">
            {applicationsData?.applications.map((app) => (
              <Card key={app._id} hover>
                <div className="flex items-start gap-4">
                  <Avatar
                    src={app.applicant.avatar}
                    firstName={app.applicant.firstName}
                    lastName={app.applicant.lastName}
                    size="lg"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-light text-stone-900 text-lg" style={{ letterSpacing: '-0.01em' }}>
                          {app.applicant.firstName} {app.applicant.lastName}
                        </h3>
                        <p className="text-sm text-stone-400">
                          {app.youthProfile?.major || 'Candidate'}
                          {app.youthProfile?.university && ` • ${app.youthProfile.university}`}
                        </p>
                      </div>
                      <Badge variant="gray" className={statusColors[app.status]}>
                        {app.status}
                      </Badge>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 text-sm text-stone-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {app.applicant.email}
                      </span>
                      {app.applicant.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {app.applicant.phone}
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    {app.youthProfile?.skills && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {app.youthProfile.skills.slice(0, 5).map((skill, idx) => (
                          <Badge key={idx} variant="info" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => handleViewDetails(app)}>
                        View Details
                      </Button>
                      {app.youthProfile?.cv && (
                        <a href={app.youthProfile.cv} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            View CV
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          title="Application Details"
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleUpdateStatus}>
                Update Status
              </Button>
            </>
          }
        >
          {selectedApp && (
            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
                <Avatar
                  src={selectedApp.applicant.avatar}
                  firstName={selectedApp.applicant.firstName}
                  lastName={selectedApp.applicant.lastName}
                  size="xl"
                />
                <div>
                  <h3 className="font-light text-stone-900 text-xl" style={{ letterSpacing: '-0.01em' }}>
                    {selectedApp.applicant.firstName} {selectedApp.applicant.lastName}
                  </h3>
                  <p className="text-stone-400 text-sm">{selectedApp.youthProfile?.major}</p>
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApp.coverLetter && (
                <div>
                  <h4 className="text-[10px] uppercase tracking-label text-stone-400 mb-2.5">Cover Letter</h4>
                  <p className="text-stone-500 text-sm whitespace-pre-wrap bg-stone-50 p-4">
                    {selectedApp.coverLetter}
                  </p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <Select
                  label="Application Status"
                  options={APPLICATION_STATUSES}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                />
              </div>

              {/* Employer Notes */}
              <Textarea
                label="Employer Notes"
                rows={4}
                placeholder="Add notes about this candidate..."
                value={employerNotes}
                onChange={(e) => setEmployerNotes(e.target.value)}
              />
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default ViewApplications;
