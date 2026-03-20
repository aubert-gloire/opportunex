import { useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Building2,
  CreditCard,
  Search,
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
  { path: '/employer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/employer/post-job', label: 'Post a Job', icon: <Briefcase className="w-4 h-4" /> },
  { path: '/employer/my-postings', label: 'My Postings', icon: <FileText className="w-4 h-4" /> },
  { path: '/employer/talent-search', label: 'Search Talent', icon: <Users className="w-4 h-4" /> },
  { path: '/employer/subscription', label: 'Subscription', icon: <CreditCard className="w-4 h-4" /> },
  { path: '/employer/profile', label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
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
        <div className="border-b border-stone-100 pb-8 mb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Recruiting</p>
          <h1 className="font-display font-light text-stone-900 text-4xl" style={{ letterSpacing: '-0.022em' }}>Search Talent</h1>
          <p className="text-stone-400 text-sm mt-2">Find qualified candidates for your positions</p>
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
                    <h3 className="font-light text-stone-900 text-lg mb-1" style={{ letterSpacing: '-0.01em' }}>
                      {candidate.firstName} {candidate.lastName}
                    </h3>
                    <p className="text-sm text-stone-400 mb-3">
                      {candidate.major} • {candidate.university}
                    </p>

                    {/* Verified Skills */}
                    {candidate.verifiedSkills && candidate.verifiedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {candidate.verifiedSkills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="success" className="text-xs">
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
