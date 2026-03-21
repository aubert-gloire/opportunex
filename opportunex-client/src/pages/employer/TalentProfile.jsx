import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard, Briefcase, Users, FileText, Building2, CreditCard,
  MapPin, GraduationCap, Award, Download, ArrowLeft, FileText as CVIcon,
} from 'lucide-react';
import { userAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';

const employerSidebarLinks = [
  { path: '/employer/dashboard',     label: 'Dashboard',       icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/employer/post-job',      label: 'Post a Job',      icon: <Briefcase className="w-4 h-4" /> },
  { path: '/employer/my-postings',   label: 'My Postings',     icon: <FileText className="w-4 h-4" /> },
  { path: '/employer/talent-search', label: 'Search Talent',   icon: <Users className="w-4 h-4" /> },
  { path: '/employer/subscription',  label: 'Subscription',    icon: <CreditCard className="w-4 h-4" /> },
  { path: '/employer/profile',       label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
];

const badgeLevel = { beginner: 'gray', intermediate: 'primary', advanced: 'success' };

const TalentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['publicProfile', id],
    queryFn: async () => (await userAPI.getPublicProfile(id)).data,
  });

  if (isLoading) {
    return (
      <DashboardLayout sidebarLinks={employerSidebarLinks}>
        <div className="text-stone-400 text-sm py-20 text-center">Loading profile…</div>
      </DashboardLayout>
    );
  }

  if (!data?.user) {
    return (
      <DashboardLayout sidebarLinks={employerSidebarLinks}>
        <div className="text-stone-400 text-sm py-20 text-center">Profile not found.</div>
      </DashboardLayout>
    );
  }

  const { user, profile } = data;

  return (
    <DashboardLayout sidebarLinks={employerSidebarLinks}>
      <div className="max-w-3xl space-y-6">

        {/* Back */}
        <button
          onClick={() => navigate('/employer/talent-search')}
          className="flex items-center gap-1.5 text-[11px] uppercase tracking-label text-stone-400 hover:text-stone-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Talent Search
        </button>

        {/* Header */}
        <div className="border-b border-stone-100 pb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Candidate Profile</p>
          <h1 className="font-display font-light text-stone-900 text-3xl sm:text-4xl" style={{ letterSpacing: '-0.022em' }}>
            {user.firstName} {user.lastName}
          </h1>
          {profile?.major && (
            <p className="text-stone-400 text-sm mt-1">
              {profile.major}{profile?.university ? ` · ${profile.university}` : ''}
            </p>
          )}
        </div>

        {/* Profile Card */}
        <Card>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar
              src={user.avatar}
              firstName={user.firstName}
              lastName={user.lastName}
              size="2xl"
              className="w-20 h-20 flex-shrink-0"
            />
            <div className="flex-1 space-y-3">
              {profile?.location && (
                <p className="flex items-center gap-1.5 text-sm text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-300" />
                  {profile.location}
                </p>
              )}
              {profile?.university && (
                <p className="flex items-center gap-1.5 text-sm text-stone-500">
                  <GraduationCap className="w-3.5 h-3.5 text-stone-300" />
                  {profile.university}{profile.graduationYear ? ` · Class of ${profile.graduationYear}` : ''}
                </p>
              )}
              {profile?.bio && (
                <p className="text-sm text-stone-500 leading-relaxed max-w-lg">{profile.bio}</p>
              )}
              {profile?.profileCompletionPercentage !== undefined && (
                <div>
                  <div className="flex justify-between text-[10px] text-stone-300 mb-1">
                    <span className="uppercase tracking-label">Profile Completion</span>
                    <span>{profile.profileCompletionPercentage}%</span>
                  </div>
                  <div className="w-full h-px bg-stone-100">
                    <div className="h-px bg-primary" style={{ width: `${profile.profileCompletionPercentage}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* CV */}
        {profile?.cv && (
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CVIcon className="w-5 h-5 text-stone-400" />
                <div>
                  <p className="text-sm font-medium text-stone-900">Resume / CV</p>
                  <p className="text-xs text-stone-400">Available for download</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(profile.cv, '_blank')}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Download CV
              </Button>
            </div>
          </Card>
        )}

        {/* Verified Skills */}
        {profile?.verifiedSkills?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-4 h-4 text-stone-400" />
                Verified Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.verifiedSkills.map((vs, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-stone-50 border border-stone-100">
                    <div>
                      <p className="text-sm text-stone-900">{vs.skill}</p>
                      <p className="text-xs text-stone-400">Score: {vs.score}%</p>
                    </div>
                    <Badge variant={badgeLevel[vs.badge] || 'gray'} className="capitalize">{vs.badge}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {profile?.skills?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s, i) => (
                  <Badge key={i} variant="gray">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preferred Sectors */}
        {profile?.preferredSectors?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Preferred Sectors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.preferredSectors.map((s, i) => (
                  <Badge key={i} variant="primary">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </DashboardLayout>
  );
};

export default TalentProfile;
