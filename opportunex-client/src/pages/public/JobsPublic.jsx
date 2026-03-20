import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';
import { jobAPI } from '@/api';
import Card, { CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { SkeletonCard } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, sectorIcons } from '@/utils/helpers';
import { SECTORS, JOB_TYPES } from '@/utils/constants';

const JobsPublic = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    sector: '',
    type: '',
    location: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobs(filters);
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Browse Job Opportunities
          </h1>
          <p className="text-gray-600">
            Discover opportunities from verified employers across Rwanda
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search jobs..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
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
                placeholder="Location (e.g., Kigali)"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="flex-1"
              />
              <Button type="submit" variant="primary">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No jobs found"
            description="Try adjusting your filters or check back later for new opportunities"
          />
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              Showing {jobs.length} opportunities
            </div>
            {jobs.map((job) => (
              <Link key={job._id} to={`/jobs/${job._id}`}>
                <Card hover className="hover:border-primary transition-all">
                  <div className="flex gap-4">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo}
                          alt={job.companyName}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold text-xl">
                          {job.companyName?.charAt(0) || 'C'}
                        </div>
                      )}
                    </div>

                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{job.companyName}</p>

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

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{formatDate(job.createdAt)}</span>
                        <span>{job.applicationsCount} applicants</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPublic;
