import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Building2,
  CreditCard,
  Award,
  MapPin,
  Download,
  ExternalLink,
} from 'lucide-react';
import { userAPI } from '@/api';
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
  { path: '/employer/dashboard',     label: 'Dashboard',       icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/employer/post-job',      label: 'Post a Job',      icon: <Briefcase className="w-4 h-4" /> },
  { path: '/employer/my-postings',   label: 'My Postings',     icon: <FileText className="w-4 h-4" /> },
  { path: '/employer/talent-search', label: 'Search Talent',   icon: <Users className="w-4 h-4" /> },
  { path: '/employer/subscription',  label: 'Subscription',    icon: <CreditCard className="w-4 h-4" /> },
  { path: '/employer/profile',       label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
];

const badgeLevel = { beginner: 'gray', intermediate: 'primary', advanced: 'success' };

const TalentSearch = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: '', sector: '', university: '', skills: '' });
  const [submitted, setSubmitted] = useState({});

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['talentSearch', submitted],
    queryFn: async () => {
      const params = {};
      if (submitted.search)     params.search     = submitted.search;
      if (submitted.sector)     params.sector     = submitted.sector;
      if (submitted.university) params.university = submitted.university;
      if (submitted.skills)     params.skills     = submitted.skills;
      return (await userAPI.searchTalent(params)).data;
    },
    enabled: true,
  });

  const handleSearch = () => setSubmitted({ ...filters });

  const candidates = data?.candidates || [];

  return (
    <DashboardLayout sidebarLinks={employerSidebarLinks}>
      <div className="space-y-6">
        <div className="border-b border-stone-100 pb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Recruiting</p>
          <h1 className="font-display font-light text-stone-900 text-3xl sm:text-4xl" style={{ letterSpacing: '-0.022em' }}>
            Search <em>Talent</em>
          </h1>
          <p className="text-stone-400 text-sm mt-2">
            {data?.count !== undefined ? `${data.count} candidates found` : 'Find qualified candidates for your positions'}
          </p>
        </div>

        {/* Filters */}
        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Name or keyword..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Input
                placeholder="Skills (e.g. Python, Finance)"
                value={filters.skills}
                onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Select
                placeholder="All Sectors"
                options={[{ value: '', label: 'All Sectors' }, ...SECTORS]}
                value={filters.sector}
                onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
              />
              <Select
                placeholder="All Universities"
                options={[{ value: '', label: 'All Universities' }, ...UNIVERSITIES]}
                value={filters.university}
                onChange={(e) => setFilters({ ...filters, university: e.target.value })}
              />
            </div>
            <Button variant="primary" onClick={handleSearch} loading={isLoading}>
              Search Candidates
            </Button>
          </div>
        </Card>

        {/* Results */}
        {isLoading ? (
          <p className="text-stone-400 text-sm">Searching…</p>
        ) : candidates.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No candidates found"
            description="Try broadening your search filters"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {candidates.map((c) => (
              <Card key={c._id} hover>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <Avatar src={c.avatar} firstName={c.firstName} lastName={c.lastName} size="md" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-light text-stone-900 text-base truncate" style={{ letterSpacing: '-0.01em' }}>
                        {c.firstName} {c.lastName}
                      </h3>
                      {c.major && (
                        <p className="text-xs text-stone-400 truncate">{c.major}</p>
                      )}
                      {c.location && (
                        <p className="text-[10px] text-stone-300 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />{c.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* University */}
                  {c.university && (
                    <p className="text-[10px] uppercase tracking-label text-stone-400">{c.university}</p>
                  )}

                  {/* Bio */}
                  {c.bio && (
                    <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">{c.bio}</p>
                  )}

                  {/* Verified Skills */}
                  {c.verifiedSkills?.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-label text-stone-400 mb-2 flex items-center gap-1">
                        <Award className="w-3 h-3" /> Verified Skills
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {c.verifiedSkills.slice(0, 4).map((vs, i) => (
                          <Badge key={i} variant={badgeLevel[vs.badge] || 'gray'}>
                            {vs.skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {!c.verifiedSkills?.length && c.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {c.skills.slice(0, 4).map((s, i) => (
                        <Badge key={i} variant="gray">{s}</Badge>
                      ))}
                    </div>
                  )}

                  {/* Profile completeness bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-stone-300 mb-1">
                      <span>Profile</span>
                      <span>{c.profileCompletionPercentage}%</span>
                    </div>
                    <div className="w-full h-px bg-stone-100">
                      <div
                        className="h-px bg-primary transition-all"
                        style={{ width: `${c.profileCompletionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-stone-50">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/talent/${c._id}`)}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Profile
                    </Button>
                    {c.cv && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(c.cv, '_blank')}
                        title="Download CV"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    )}
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
