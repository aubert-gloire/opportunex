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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-600 mb-6 transition-colors"
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
                className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-3xl">
                {job.companyName?.charAt(0) || 'C'}
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                <Building2 className="w-5 h-5" />
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {job.description}
              </div>
            </Card>

            {job.requirements && job.requirements.length > 0 && (
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-accent mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <Card>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
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
              <h3 className="font-semibold text-gray-900 mb-4">Job Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{job.location}</p>
                    {job.isRemote && <Badge variant="success" className="mt-1">Remote</Badge>}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500">Job Type</p>
                    <p className="font-medium text-gray-900 capitalize">{job.type}</p>
                  </div>
                </div>

                {job.salaryRange && job.salaryRange.min && (
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500">Salary Range</p>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(job.salaryRange.min)} - {formatCurrency(job.salaryRange.max)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500">Posted</p>
                    <p className="font-medium text-gray-900">{formatDate(job.createdAt)}</p>
                  </div>
                </div>

                {job.applicationDeadline && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-gray-500">Deadline</p>
                      <p className="font-medium text-gray-900">{formatDate(job.applicationDeadline)}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {job.companyDescription && (
              <Card>
                <h3 className="font-semibold text-gray-900 mb-3">About {job.companyName}</h3>
                <p className="text-sm text-gray-700">{job.companyDescription}</p>
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
