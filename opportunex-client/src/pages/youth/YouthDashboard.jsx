import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FileText, Users,
  GraduationCap, User, BookOpen, PlayCircle, Clock,
  TrendingUp, TrendingDown, ArrowRight, Sparkles, ChevronRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from 'recharts';
import { userAPI, jobAPI, applicationAPI, mentorshipAPI, courseAPI, aiAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate, statusColors } from '@/utils/helpers';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const youthSidebarLinks = [
  { path: '/youth/dashboard',    label: 'Dashboard',   icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/youth/jobs',         label: 'Find Jobs',   icon: <Briefcase className="w-4 h-4" /> },
  { path: '/youth/applications', label: 'Applications',icon: <FileText className="w-4 h-4" /> },
  { path: '/youth/courses',      label: 'Courses',     icon: <BookOpen className="w-4 h-4" /> },
  { path: '/youth/my-courses',   label: 'My Courses',  icon: <BookOpen className="w-4 h-4" /> },
  { path: '/youth/mentorship',   label: 'Mentorship',  icon: <Users className="w-4 h-4" /> },
  { path: '/youth/skill-tests',  label: 'Skill Tests', icon: <GraduationCap className="w-4 h-4" /> },
  { path: '/youth/profile',      label: 'My Profile',  icon: <User className="w-4 h-4" /> },
];

// Generate last-6-weeks buckets from applications array
const buildWeeklyTrend = (apps = []) => {
  const weeks = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const count = apps.filter((a) => {
      const d = new Date(a.createdAt);
      return d >= weekStart && d < weekEnd;
    }).length;
    weeks.push({ week: label, applications: count });
  }
  return weeks;
};

// Calm, editorial chart palette
const CHART_COLORS = ['#1E3A5F', '#4F7CAC', '#6B9E78', '#C4A46B', '#9B8EC4', '#B5665E'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-stone-100 px-3 py-2 text-xs text-stone-700 shadow-sm">
      {label && <p className="text-stone-400 mb-1 uppercase tracking-label" style={{ fontSize: '9px' }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i}><span className="font-medium">{p.value}</span> {p.name}</p>
      ))}
    </div>
  );
};

const YouthDashboard = () => {
  const { user } = useAuth();
  const [tipsLoaded, setTipsLoaded] = useState(false);

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => (await userAPI.getProfile()).data,
  });

  const { data: allApplications } = useQuery({
    queryKey: ['allApplications'],
    queryFn: async () => (await applicationAPI.getMyApplications()).data.applications,
  });

  const { data: recommendedJobs } = useQuery({
    queryKey: ['recommendedJobs'],
    queryFn: async () => (await jobAPI.getRecommendedJobs()).data.jobs?.slice(0, 5) ?? [],
  });

  const { data: upcomingSessions } = useQuery({
    queryKey: ['upcomingSessions'],
    queryFn: async () => (await mentorshipAPI.getMySessions({ role: 'mentee', status: 'confirmed' })).data.sessions?.slice(0, 3) ?? [],
  });

  const { data: myCourses } = useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => (await courseAPI.getMyCourses()).data.enrollments?.slice(0, 3) ?? [],
  });

  const { data: recommendedCourses } = useQuery({
    queryKey: ['recommended-courses'],
    queryFn: async () => (await courseAPI.getRecommendedCourses()).data.courses?.slice(0, 3) ?? [],
  });

  const { data: careerTipsData, isLoading: tipsLoading, refetch: loadTips } = useQuery({
    queryKey: ['career-tips'],
    queryFn: async () => (await aiAPI.getCareerTips()).data.tips ?? [],
    enabled: tipsLoaded,
    staleTime: 30 * 60 * 1000, // 30 min
  });

  const profile = profileData?.profile;
  const completionPercentage = profile?.profileCompletionPercentage || 0;
  const recentApplications = allApplications?.slice(0, 5);

  const weeklyTrend = buildWeeklyTrend(allApplications || []);
  const trendTotal = weeklyTrend.reduce((s, w) => s + w.applications, 0);
  const trendLastWeek = weeklyTrend[weeklyTrend.length - 1]?.applications || 0;
  const trendPrevWeek = weeklyTrend[weeklyTrend.length - 2]?.applications || 0;
  const trendUp = trendLastWeek >= trendPrevWeek;

  // Compute application status breakdown for pie chart
  const appStatusMap = (allApplications || []).reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});
  const appPieData = Object.entries(appStatusMap).map(([status, count]) => ({ name: status, value: count }));

  // Skills for bar chart
  const verifiedSkills = profile?.verifiedSkills || [];
  const skillsBarData = verifiedSkills.slice(0, 6).map((vs) => ({
    skill: vs.skill.length > 10 ? vs.skill.slice(0, 10) + '…' : vs.skill,
    score: vs.score,
  }));

  const appDelta = trendLastWeek - trendPrevWeek;
  const stats = [
    { label: 'Profile',         value: `${completionPercentage}%`, sub: 'completion', delta: null },
    { label: 'Applications',    value: allApplications?.length || 0, sub: 'submitted', delta: appDelta },
    { label: 'Verified Skills', value: verifiedSkills.length,        sub: 'certified', delta: null },
    { label: 'Sessions',        value: upcomingSessions?.length || 0, sub: 'upcoming', delta: null },
  ];

  return (
    <DashboardLayout sidebarLinks={youthSidebarLinks}>
      <div className="space-y-8">

        {/* Header */}
        <div className="border-b border-stone-100 pb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Dashboard</p>
          <h1 className="font-display font-light text-stone-900 text-3xl sm:text-4xl" style={{ letterSpacing: '-0.022em' }}>
            Welcome back, <em>{user?.firstName}</em>
          </h1>
          <p className="text-stone-400 text-sm mt-2">Here's what's happening with your career search.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-stone-100 divide-x divide-y md:divide-y-0 divide-stone-100">
          {stats.map(({ label, value, sub, delta }) => (
            <div key={label} className="p-6">
              <div className="font-display text-3xl font-light text-stone-900" style={{ letterSpacing: '-0.02em' }}>{value}</div>
              <div className="text-[10px] uppercase tracking-label text-stone-400 mt-1">{label}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="text-[10px] text-stone-300">{sub}</div>
                {delta !== null && delta !== 0 && (
                  <span className={`text-[10px] ${delta > 0 ? 'text-[#6B9E78]' : 'text-[#B5665E]'}`}>
                    {delta > 0 ? '+' : ''}{delta}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Profile completion nudge */}
        {completionPercentage < 80 && (
          <div className="border-l-2 border-accent pl-5 py-1 flex items-start sm:items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium text-stone-900">Complete your profile ({completionPercentage}%)</p>
              <p className="text-xs text-stone-400 mt-0.5">Profiles with higher completion get 3× more employer views</p>
            </div>
            <Link to="/youth/profile">
              <Button variant="outline" size="sm">Complete</Button>
            </Link>
          </div>
        )}

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Application status chart */}
          <Card padding={false}>
            <CardHeader className="px-6 pt-6 pb-4 border-b border-stone-100">
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {appPieData.length > 0 ? (
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width={140} height={140}>
                    <PieChart>
                      <Pie
                        data={appPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={62}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {appPieData.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {appPieData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span className="text-xs text-stone-500 capitalize">{item.name}</span>
                        <span className="text-xs font-medium text-stone-900 ml-auto pl-4">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-stone-400 text-center py-10">No applications yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Verified skills score chart */}
          <Card padding={false}>
            <CardHeader className="px-6 pt-6 pb-4 border-b border-stone-100">
              <CardTitle>Skill Scores</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {skillsBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={skillsBarData} barSize={12}>
                    <CartesianGrid vertical={false} stroke="#f5f5f4" />
                    <XAxis
                      dataKey="skill"
                      tick={{ fontSize: 9, fill: '#a8a29e', fontFamily: 'Inter' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 9, fill: '#a8a29e' }}
                      axisLine={false}
                      tickLine={false}
                      width={24}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="score" name="score" fill="#1E3A5F" radius={[1, 1, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-stone-400 text-center py-10">Take skill tests to see scores.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Weekly Activity Trend */}
        <Card padding={false}>
          <CardHeader className="px-6 pt-6 pb-4 border-b border-stone-100 flex items-center justify-between">
            <CardTitle>Application Activity</CardTitle>
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              {trendUp ? <TrendingUp className="w-3.5 h-3.5 text-[#6B9E78]" /> : <TrendingDown className="w-3.5 h-3.5 text-[#B5665E]" />}
              <span className={trendUp ? 'text-[#6B9E78]' : 'text-[#B5665E]'}>
                {trendLastWeek} this week
              </span>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4">
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={weeklyTrend} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f5f5f4" />
                <XAxis dataKey="week" tick={{ fontSize: 9, fill: '#a8a29e' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 9, fill: '#a8a29e' }} axisLine={false} tickLine={false} width={20} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="applications" name="applications" stroke="#1E3A5F" strokeWidth={1.5} fill="url(#appGrad)" dot={{ r: 3, fill: '#1E3A5F', strokeWidth: 0 }} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Jobs & Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recommended Jobs */}
          <Card padding={false}>
            <CardHeader className="px-6 pt-6 pb-4 border-b border-stone-100">
              <CardTitle>Recommended Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendedJobs && recommendedJobs.length > 0 ? (
                <div>
                  {recommendedJobs.map((job) => (
                    <Link
                      key={job._id}
                      to={`/jobs/${job._id}`}
                      className="flex items-start justify-between px-6 py-4 border-b border-stone-50 hover:bg-stone-50 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-stone-900">{job.title}</p>
                        <p className="text-xs text-stone-400 mt-0.5">{job.companyName}</p>
                      </div>
                      <Badge variant="primary">{job.type}</Badge>
                    </Link>
                  ))}
                  <div className="px-6 py-4">
                    <Link to="/youth/jobs">
                      <Button variant="ghost" size="sm">View all jobs</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-stone-400 text-center py-10 px-6">
                  Complete your profile to get personalised recommendations.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card padding={false}>
            <CardHeader className="px-6 pt-6 pb-4 border-b border-stone-100">
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {recentApplications && recentApplications.length > 0 ? (
                <div>
                  {recentApplications.map((app) => (
                    <div key={app._id} className="flex items-start justify-between px-6 py-4 border-b border-stone-50">
                      <div>
                        <p className="text-sm font-medium text-stone-900">{app.job?.title}</p>
                        <p className="text-xs text-stone-400 mt-0.5">{formatDate(app.createdAt)}</p>
                      </div>
                      <Badge variant="gray" className={statusColors[app.status]}>{app.status}</Badge>
                    </div>
                  ))}
                  <div className="px-6 py-4">
                    <Link to="/youth/applications">
                      <Button variant="ghost" size="sm">View all applications</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-stone-400 text-center py-10 px-6">No applications yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Courses */}
        <Card padding={false}>
          <CardHeader className="px-6 pt-6 pb-4 border-b border-stone-100">
            <CardTitle>{myCourses && myCourses.length > 0 ? 'Continue Learning' : 'Recommended Courses'}</CardTitle>
          </CardHeader>
          <CardContent>
            {myCourses && myCourses.length > 0 ? (
              <div>
                {myCourses.map((enrollment) => {
                  const course = enrollment.course;
                  return (
                    <Link
                      key={enrollment._id}
                      to={`/youth/courses/${course._id}/learn`}
                      className="flex items-center gap-4 px-6 py-4 border-b border-stone-50 hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate">{course.title}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 max-w-[120px] bg-stone-100 h-0.5">
                            <div className="bg-primary h-0.5" style={{ width: `${enrollment.progress}%` }} />
                          </div>
                          <span className="text-xs text-stone-400">{enrollment.progress}%</span>
                        </div>
                      </div>
                      <PlayCircle className="w-4 h-4 text-stone-300 flex-shrink-0" />
                    </Link>
                  );
                })}
                <div className="px-6 py-4">
                  <Link to="/youth/my-courses"><Button variant="ghost" size="sm">View all courses</Button></Link>
                </div>
              </div>
            ) : recommendedCourses && recommendedCourses.length > 0 ? (
              <div>
                {recommendedCourses.map((course) => (
                  <Link
                    key={course._id}
                    to={`/youth/courses/${course._id}`}
                    className="flex items-center justify-between px-6 py-4 border-b border-stone-50 hover:bg-stone-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-stone-900">{course.title}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{course.lessons?.length} lessons</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="primary">{course.category}</Badge>
                      {course.price === 0 && <Badge variant="success">Free</Badge>}
                    </div>
                  </Link>
                ))}
                <div className="px-6 py-4">
                  <Link to="/youth/courses"><Button variant="ghost" size="sm">Browse all courses</Button></Link>
                </div>
              </div>
            ) : (
              <p className="text-sm text-stone-400 text-center py-10 px-6">No courses available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Mentorship sessions */}
        {upcomingSessions && upcomingSessions.length > 0 && (
          <Card padding={false}>
            <CardHeader className="px-6 pt-6 pb-4 border-b border-stone-100">
              <CardTitle>Upcoming Mentorship Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingSessions.map((session) => (
                <div key={session._id} className="flex items-start justify-between px-6 py-4 border-b border-stone-50">
                  <div>
                    <p className="text-sm font-medium text-stone-900">{session.topic}</p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      with {session.mentor?.firstName} {session.mentor?.lastName}
                    </p>
                    <p className="text-xs text-stone-300 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />{formatDate(session.scheduledAt)}
                    </p>
                  </div>
                  <Badge variant="success">{session.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* AI Career Tips */}
        <Card padding={false}>
          <CardHeader className="px-6 pt-6 pb-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <CardTitle>AI Career Tips</CardTitle>
            </div>
            {!tipsLoaded && (
              <button
                onClick={() => { setTipsLoaded(true); loadTips(); }}
                className="text-[10px] uppercase tracking-label text-primary border border-primary px-2.5 py-1 hover:bg-primary hover:text-white transition-colors"
              >
                Generate
              </button>
            )}
          </CardHeader>
          <CardContent className="p-6">
            {!tipsLoaded && (
              <p className="text-sm text-stone-400 text-center py-4">
                Get personalised career advice powered by Google Gemini AI.
              </p>
            )}
            {tipsLoaded && tipsLoading && (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 bg-stone-50 animate-pulse" />
                ))}
              </div>
            )}
            {tipsLoaded && !tipsLoading && careerTipsData?.length > 0 && (
              <div className="space-y-4">
                {careerTipsData.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="text-[10px] uppercase tracking-label text-primary mt-0.5 w-4 flex-shrink-0">{i + 1}</div>
                    <div>
                      <p className="text-sm font-medium text-stone-900">{item.tip}</p>
                      <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                        <ChevronRight className="w-3 h-3" />{item.action}
                      </p>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => loadTips()}
                  className="text-[10px] uppercase tracking-label text-stone-400 hover:text-primary transition-colors mt-2"
                >
                  Refresh tips
                </button>
              </div>
            )}
            {tipsLoaded && !tipsLoading && !careerTipsData?.length && (
              <p className="text-sm text-stone-400 text-center py-4">
                Complete your profile to get personalised tips.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/youth/jobs',        label: 'Find Jobs'   },
            { to: '/youth/courses',     label: 'Courses'     },
            { to: '/youth/skill-tests', label: 'Skill Tests' },
            { to: '/youth/mentorship',  label: 'Find Mentor' },
          ].map(({ to, label }) => (
            <Link key={to} to={to}>
              <Button variant="outline" className="w-full">{label}</Button>
            </Link>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default YouthDashboard;
