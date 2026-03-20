import { useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Building2,
  CreditCard,
  Search,
  Filter,
  Award,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';
import { SECTORS, UNIVERSITIES } from '@/utils/constants';

const employerSidebarLinks = [
  { path: '/employer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/employer/post-job', label: 'Post a Job', icon: <Briefcase className="w-5 h-5" /> },
  { path: '/employer/my-postings', label: 'My Postings', icon: <FileText className="w-5 h-5" /> },
  { path: '/employer/talent-search', label: 'Search Talent', icon: <Users className="w-5 h-5" /> },
  { path: '/employer/subscription', label: 'Subscription', icon: <CreditCard className="w-5 h-5" /> },
  { path: '/employer/profile', label: 'Company Profile', icon: <Building2 className="w-5 h-5" /> },
];

const TalentSearch = () => {
  const [filters, setFilters] = useState({
    search: '',
    sector: '',
    university: '',
    skills: '',
  });

  const [candidates] = useState([]); // TODO: Implement search API

  return (
    <DashboardLayout sidebarLinks={employerSidebarLinks}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Talent</h1>
          <p className="text-gray-600">Find qualified candidates for your positions</p>
        </div>

        {/* Search Filters */}
        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search by name or skills..."
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
                placeholder="All Universities"
                options={UNIVERSITIES}
                value={filters.university}
                onChange={(e) => setFilters({ ...filters, university: e.target.value })}
              />
            </div>
            <Button variant="primary">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </Card>

        {/* Results */}
        {candidates.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Start your search"
            description="Use the filters above to find qualified candidates"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <Card key={candidate._id} hover>
                <div className="flex items-start gap-4">
                  <Avatar
                    src={candidate.avatar}
                    firstName={candidate.firstName}
                    lastName={candidate.lastName}
                    size="lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {candidate.firstName} {candidate.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {candidate.major} • {candidate.university}
                    </p>

                    {/* Verified Skills */}
                    {candidate.verifiedSkills && candidate.verifiedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {candidate.verifiedSkills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="success" className="text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            {skill.skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Button variant="primary" size="sm" className="w-full">
                      View Profile
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

export default TalentSearch;
