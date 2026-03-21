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
  Sparkles,
  ExternalLink,
  Globe,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { jobAPI, applicationAPI, aiAPI, externalAPI } from '@/api';
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
  { path: '/youth/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/youth/jobs', label: 'Find Jobs', icon: <Briefcase className="w-4 h-4" /> },
  { path: '/youth/applications', label: 'My Applications', icon: <FileText className="w-4 h-4" /> },
  { path: '/youth/mentorship', label: 'Mentorship', icon: <Users className="w-4 h-4" /> },
  { path: '/youth/skill-tests', label: 'Skill Tests', icon: <GraduationCap className="w-4 h-4" /> },
  { path: '/youth/profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
];

const JobSearch = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('platform'); // 'platform' | 'remote'
  const [filters, setFilters] = useState({
    search: '',
    sector: '',
    type: '',
    location: '',
  });
  const [selectedJob, setSelectedJob] = useState(location.state?.applyToJob || null);
  const [showApplyModal, setShowApplyModal] = useState(!!location.state?.applyToJob);
  const [coverLetter, setCoverLetter] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  const { data: jobsData, isLoading, refetch } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const response = await jobAPI.getJobs(filters);
      return response.data;
    },
  });

  const { data: externalData, isLoading: externalLoading } = useQuery({
    queryKey: ['external-jobs', filters.search],
    queryFn: async () => {
      const response = await externalAPI.getJobs({ search: filters.search, limit: 12 });
      return response.data;
    },
    enabled: activeTab === 'remote',
    staleTime: 5 * 60 * 1000, // 5 min cache
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

  const handleGenerateCoverLetter = async () => {
    if (!selectedJob) return;
    setAiGenerating(true);
    try {
      const { data } = await aiAPI.generateCoverLetter({
        jobTitle: selectedJob.title,
        companyName: selectedJob.companyName,
      });
      if (data.coverLetter) {
        setCoverLetter(data.coverLetter);
        toast.success('Cover letter generated');
      }
    } catch {
      toast.error('AI generation failed — add GEMINI_API_KEY to server .env');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <DashboardLayout sidebarLinks={youthSidebarLinks}>
      <div className="space-y-6">
        <div className="border-b border-stone-100 pb-8 mb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Opportunities</p>
          <h1 className="font-display font-light text-stone-900 text-3xl sm:text-4xl" style={{ letterSpacing: '-0.022em' }}>Find Jobs</h1>
          <p className="text-stone-400 text-sm mt-2">Discover opportunities that match your skills</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-100">
          {[
            { key: 'platform', label: 'Platform Jobs', icon: <Briefcase className="w-3.5 h-3.5" /> },
            { key: 'remote',   label: 'Remote Opportunities', icon: <Globe className="w-3.5 h-3.5" /> },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-3 text-[10px] uppercase tracking-label border-b-2 transition-colors ${
                activeTab === key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              {icon}{label}
            </button>
          ))}
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
                Search
              </Button>
            </div>
          </div>
        </Card>

        {/* Platform Jobs Results */}
        {activeTab === 'platform' && (
          isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : jobsData?.jobs.length === 0 ? (
            <EmptyState icon={Briefcase} title="No jobs found" description="Try adjusting your filters" />
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-stone-400">
                Showing {jobsData?.jobs.length} of {jobsData?.count} opportunities
              </div>
              {jobsData?.jobs.map((job) => (
                <Card key={job._id} hover>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.companyName} className="w-16 h-16 object-cover" />
                      ) : (
                        <div className="w-16 h-16 bg-stone-100 flex items-center justify-center text-stone-600 font-light text-xl">
                          {job.companyName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/jobs/${job._id}`}>
                        <h3 className="text-lg font-light text-stone-900 mb-1 hover:text-primary transition-colors" style={{ letterSpacing: '-0.01em' }}>
                          {job.title}
                        </h3>
                      </Link>
                      <p className="text-stone-400 text-sm mb-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />{job.companyName}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="primary">{job.type}</Badge>
                        {job.sector && <Badge variant="gray">{sectorIcons[job.sector]} {job.sector}</Badge>}
                        <Badge variant="gray"><MapPin className="w-3 h-3 mr-1" />{job.location}</Badge>
                        {job.isRemote && <Badge variant="success">Remote</Badge>}
                        {job.salaryUsd?.min && (
                          <Badge variant="gray">
                            ~${job.salaryUsd.min.toLocaleString()}
                            {job.salaryUsd.max ? `–$${job.salaryUsd.max.toLocaleString()}` : '+'} /mo
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-400">Posted {formatDate(job.createdAt)}</span>
                        <Button variant="accent" size="sm" onClick={() => handleApply(job)}>Apply Now</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        )}

        {/* Remote Opportunities Results */}
        {activeTab === 'remote' && (
          externalLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : !externalData?.jobs?.length ? (
            <EmptyState icon={Globe} title="No remote jobs found" description="Try a different search term" />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-stone-400">{externalData.jobs.length} remote opportunities worldwide</div>
                <p className="text-[10px] uppercase tracking-label text-stone-300">Via RemoteOK & Jobicy</p>
              </div>
              {externalData.jobs.map((job) => (
                <Card key={job._id} hover>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {job.companyLogo ? (
                        <img src={job.companyLogo} alt={job.companyName} className="w-16 h-16 object-cover" />
                      ) : (
                        <div className="w-16 h-16 bg-stone-100 flex items-center justify-center text-stone-600 font-light text-xl">
                          {job.companyName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-light text-stone-900 mb-1" style={{ letterSpacing: '-0.01em' }}>
                        {job.title}
                      </h3>
                      <p className="text-stone-400 text-sm mb-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />{job.companyName}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="success">Remote</Badge>
                        <Badge variant="gray"><MapPin className="w-3 h-3 mr-1" />{job.location}</Badge>
                        <Badge variant="gray">{job.source}</Badge>
                        {job.tags?.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="gray">{tag}</Badge>
                        ))}
                      </div>
                      {job.description && (
                        <p className="text-xs text-stone-400 mb-3 line-clamp-2">{job.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-stone-400">Posted {formatDate(job.createdAt)}</span>
                        <a href={job.externalUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />Apply Externally
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
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
                <h3 className="font-light text-stone-900 text-xl" style={{ letterSpacing: '-0.01em' }}>{selectedJob.title}</h3>
                <p className="text-stone-400 text-sm">{selectedJob.companyName}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-[10px] uppercase tracking-label text-stone-400">Cover Letter</label>
                  <button
                    type="button"
                    onClick={handleGenerateCoverLetter}
                    disabled={aiGenerating}
                    className="flex items-center gap-1.5 text-[10px] uppercase tracking-label text-primary border border-primary px-2.5 py-1 hover:bg-primary hover:text-white transition-colors disabled:opacity-40"
                  >
                    <Sparkles className="w-3 h-3" />
                    {aiGenerating ? 'Generating…' : 'Generate with AI'}
                  </button>
                </div>
                <Textarea
                  rows={8}
                  placeholder="Tell the employer why you're a great fit… or click Generate with AI."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              <div className="bg-stone-50 border border-stone-100 p-4">
                <p className="text-sm text-stone-500">
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
