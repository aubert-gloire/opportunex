import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  GraduationCap,
  User,
  Clock,
  Award,
  TrendingUp,
} from 'lucide-react';
import { skillAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Select from '@/components/ui/Select';
import EmptyState from '@/components/ui/EmptyState';
import { SKILL_CATEGORIES } from '@/utils/constants';
import { skillBadges, formatDate } from '@/utils/helpers';

const youthSidebarLinks = [
  { path: '/youth/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/youth/jobs', label: 'Find Jobs', icon: <Briefcase className="w-4 h-4" /> },
  { path: '/youth/applications', label: 'My Applications', icon: <FileText className="w-4 h-4" /> },
  { path: '/youth/mentorship', label: 'Mentorship', icon: <Users className="w-4 h-4" /> },
  { path: '/youth/skill-tests', label: 'Skill Tests', icon: <GraduationCap className="w-4 h-4" /> },
  { path: '/youth/profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
];

const SkillTests = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: testsData, isLoading: loadingTests } = useQuery({
    queryKey: ['skillTests', categoryFilter],
    queryFn: async () => {
      const response = await skillAPI.getSkillTests({ category: categoryFilter });
      return response.data;
    },
    enabled: activeTab === 'available',
  });

  const { data: resultsData, isLoading: loadingResults } = useQuery({
    queryKey: ['myResults'],
    queryFn: async () => {
      const response = await skillAPI.getMyResults();
      return response.data;
    },
    enabled: activeTab === 'results',
  });

  return (
    <DashboardLayout sidebarLinks={youthSidebarLinks}>
      <div className="space-y-6">
        <div className="border-b border-stone-100 pb-8 mb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Skills</p>
          <h1 className="font-display font-light text-stone-900 text-4xl" style={{ letterSpacing: '-0.022em' }}>Skill Tests</h1>
          <p className="text-stone-400 text-sm mt-2">Verify your skills and earn badges</p>
        </div>

        {/* Info Banner */}
        <Card className="border-stone-100">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-stone-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-light text-stone-900 mb-1" style={{ letterSpacing: '-0.01em' }}>Earn Verified Badges</h3>
              <p className="text-sm text-stone-400">
                Pass skill tests to add verified badges to your profile. Employers are 5x more likely to view profiles with verified skills!
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-stone-100">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 text-sm font-light transition-colors border-b-2 ${activeTab === 'available'
                ? 'border-primary text-primary'
                : 'border-transparent text-stone-400 hover:text-stone-900'
              }`}
          >
            Available Tests
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-6 py-3 text-sm font-light transition-colors border-b-2 ${activeTab === 'results'
                ? 'border-primary text-primary'
                : 'border-transparent text-stone-400 hover:text-stone-900'
              }`}
          >
            My Results
          </button>
        </div>

        {/* Available Tests */}
        {activeTab === 'available' && (
          <>
            <Card>
              <Select
                label="Filter by Category"
                options={['All Categories', ...SKILL_CATEGORIES]}
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value === 'All Categories' ? '' : e.target.value)
                }
                className="max-w-xs"
              />
            </Card>

            {loadingTests ? (
              <p className="text-stone-400 text-sm">Loading tests...</p>
            ) : testsData?.tests.length === 0 ? (
              <EmptyState
                icon={GraduationCap}
                title="No tests available"
                description="Check back soon for new skill tests"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testsData?.tests.map((test) => (
                  <Card key={test._id} hover className="flex flex-col">
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="info">{test.category}</Badge>
                          <Badge
                            variant={
                              test.difficulty === 'advanced'
                                ? 'danger'
                                : test.difficulty === 'intermediate'
                                  ? 'warning'
                                  : 'success'
                            }
                          >
                            {test.difficulty}
                          </Badge>
                        </div>
                        <h3 className="font-light text-stone-900 text-lg mb-2" style={{ letterSpacing: '-0.01em' }}>{test.title}</h3>
                        <p className="text-stone-400 text-sm line-clamp-2">{test.description}</p>
                      </div>

                      <div className="space-y-2 text-sm text-stone-400">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{test.questions.length} questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{test.duration} minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>{test.passingScore}% to pass</span>
                        </div>
                      </div>
                    </div>

                    <Link to={`/youth/skill-tests/${test._id}/take`} className="mt-4">
                      <Button variant="primary" className="w-full">
                        Start Test
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* My Results */}
        {activeTab === 'results' && (
          <div className="space-y-4">
            {loadingResults ? (
              <p className="text-stone-400 text-sm">Loading results...</p>
            ) : resultsData?.results.length === 0 ? (
              <EmptyState
                icon={Award}
                title="No test results yet"
                description="Take a skill test to see your results here"
                action={
                  <Button variant="primary" onClick={() => setActiveTab('available')}>
                    Browse Tests
                  </Button>
                }
              />
            ) : (
              resultsData?.results.map((result) => (
                <Card key={result._id}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-light text-stone-900 text-lg mb-1" style={{ letterSpacing: '-0.01em' }}>
                        {result.test.title}
                      </h3>
                      <p className="text-sm text-stone-400 mb-3">
                        Completed {formatDate(result.completedAt)}
                      </p>
                      <div className="flex items-center gap-3">
                        <Badge variant={result.passed ? 'success' : 'danger'}>
                          {result.passed ? 'Passed' : 'Failed'}
                        </Badge>
                        {result.badge && (
                          <Badge className={skillBadges[result.badge].color}>
                            <Award className="w-3 h-3 mr-1" />
                            {skillBadges[result.badge].label}
                          </Badge>
                        )}
                        <Badge variant="gray">{result.test.difficulty}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display font-light text-primary text-4xl mb-1">
                        {result.percentage}%
                      </div>
                      <p className="text-sm text-stone-400">
                        {result.score} / {result.totalPoints} points
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SkillTests;
