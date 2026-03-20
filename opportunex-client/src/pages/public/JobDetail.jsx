import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Briefcase, Clock, DollarSign, Calendar, ArrowLeft, Building2 } from 'lucide-react';
import { jobAPI } from '@/api';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { LoadingScreen } from '@/components/ui/Spinner';
import { formatDate, formatCurrency, sectorIcons } from '@/utils/helpers';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await jobAPI.getJob(id);
      setJob(response.data.job);
    } catch (error) {
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (user.role !== 'youth') {
      toast.error('Only youth can apply to jobs');
      return;
    }

    navigate('/youth/jobs', { state: { applyToJob: job } });
  };

  if (loading) return <LoadingScreen />;

  if (!job) return null;

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to jobs
        </Link>

        {/* Job Header */}
        <Card className="mb-6">
          <div className="flex items-start gap-6">
            {/* Company Logo */}
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="w-24 h-24 object-cover border border-stone-100"
              />
            ) : (
              <div className="w-24 h-24 bg-stone-100 flex items-center justify-center text-stone-500 font-light text-3xl">
                {job.companyName?.charAt(0) || 'C'}
              </div>
            )}

            <div className="flex-1">
              <h1 className="font-display font-light text-stone-900 text-3xl mb-2" style={{ letterSpacing: '-0.022em' }}>{job.title}</h1>
              <div className="flex items-center gap-2 text-stone-400 text-sm mb-4">
                <Building2 className="w-4 h-4" />
                {job.companyName}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="primary">{job.type}</Badge>
                {job.sector && (
                  <Badge variant="gray">
                    {sectorIcons[job.sector]} {job.sector}
                  </Badge>
                )}
                <Badge variant={job.status === 'open' ? 'success' : 'gray'}>
                  {job.status}
                </Badge>
              </div>

              <Button variant="accent" size="lg" onClick={handleApply}>
                Apply Now
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="font-light text-stone-900 text-xl mb-4" style={{ letterSpacing: '-0.01em' }}>Job Description</h2>
              <div className="text-stone-500 text-sm whitespace-pre-wrap leading-relaxed">
                {job.description}
              </div>
            </Card>

            {job.requirements && job.requirements.length > 0 && (
              <Card>
                <h2 className="font-light text-stone-900 text-xl mb-4" style={{ letterSpacing: '-0.01em' }}>Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-stone-500 text-sm">
                      <span className="text-accent mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <Card>
                <h2 className="font-light text-stone-900 text-xl mb-4" style={{ letterSpacing: '-0.01em' }}>Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, index) => (
                    <Badge key={index} variant="info">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-[10px] uppercase tracking-label text-stone-400 mb-4">Job Details</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-stone-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-stone-400 text-xs">Location</p>
                    <p className="font-light text-stone-900">{job.location}</p>
                    {job.isRemote && <Badge variant="success" className="mt-1">Remote</Badge>}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="w-4 h-4 text-stone-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-stone-400 text-xs">Job Type</p>
                    <p className="font-light text-stone-900 capitalize">{job.type}</p>
                  </div>
                </div>

                {job.salaryRange && job.salaryRange.min && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-4 h-4 text-stone-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-stone-400 text-xs">Salary Range</p>
                      <p className="font-light text-stone-900">
                        {formatCurrency(job.salaryRange.min)} - {formatCurrency(job.salaryRange.max)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-stone-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-stone-400 text-xs">Posted</p>
                    <p className="font-light text-stone-900">{formatDate(job.createdAt)}</p>
                  </div>
                </div>

                {job.applicationDeadline && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-stone-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-stone-400 text-xs">Deadline</p>
                      <p className="font-light text-stone-900">{formatDate(job.applicationDeadline)}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {job.companyDescription && (
              <Card>
                <h3 className="text-[10px] uppercase tracking-label text-stone-400 mb-3">About {job.companyName}</h3>
                <p className="text-sm text-stone-500">{job.companyDescription}</p>
              </Card>
            )}

            <Button variant="primary" className="w-full" size="lg" onClick={handleApply}>
              Apply for This Position
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
