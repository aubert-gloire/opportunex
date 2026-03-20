import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, FileText, Users,
  GraduationCap, User, BookOpen, PlayCircle, Clock,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { userAPI, jobAPI, applicationAPI, mentorshipAPI, courseAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate, statusColors } from '@/utils/helpers';
import { useAuth } from '@/context/AuthContext';

const youthSidebarLinks = [
  { path: '/youth/dashboard',   label: 'Dashboard',       icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/youth/jobs',        label: 'Find Jobs',        icon: <Briefcase className="w-4 h-4" /> },
  { path: '/youth/applications',label: 'Applications',     icon: <FileText className="w-4 h-4" /> },
  { path: '/youth/courses',     label: 'Courses',          icon: <BookOpen className="w-4 h-4" /> },
  { path: '/youth/my-courses',  label: 'My Courses',       icon: <BookOpen className="w-4 h-4" /> },
  { path: '/youth/mentorship',  label: 'Mentorship',       icon: <Users className="w-4 h-4" /> },
  { path: '/youth/skill-tests', label: 'Skill Tests',      icon: <GraduationCap className="w-4 h-4" /> },
  { path: '/youth/profile',     label: 'My Profile',       icon: <User className="w-4 h-4" /> },
];

const YouthDashboard = () => {
  const { user } = useAuth();

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => (await userAPI.getProfile()).data,
  });

  const { data: recommendedJobs } = useQuery({
    queryKey: ['recommendedJobs'],
    queryFn: async () => (await jobAPI.getRecommendedJobs()).data.jobs.slice(0, 5),
  });

  const { data: recentApplications } = useQuery({
    queryKey: ['recentApplications'],
    queryFn: async () => (await applicationAPI.getMyApplications({ limit: 5 })).data.applications,
  });

  const { data: upcomingSessions } = useQuery({
    queryKey: ['upcomingSessions'],
    queryFn: async () => (await mentorshipAPI.getMySessions({ role: 'mentee', status: 'confirmed' })).data.sessions.slice(0, 3),
  });

  const { data: myCourses } = useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => (await courseAPI.getMyCourses()).data.enrollments.slice(0, 3),
  });

  const { data: recommendedCourses } = useQuery({
    queryKey: ['recommended-courses'],
    queryFn: async () => (await courseAPI.getRecommendedCourses()).data.courses.slice(0, 3),
  });

  const profile = profileData?.profile;
  const completionPercentage = profile?.profileCompletionPercentage || 0;

  const stats = [
    { label: 'Profile',          value: `${completionPercentage}%`,              sub: 'completion'          },
    { label: 'Applications',     value: recentApplications?.length || 0,         sub: 'submitted'           },
    { label: 'Verified Skills',  value: profile?.verifiedSkills?.length || 0,    sub: 'certified'           },
    { label: 'Sessions',         value: upcomingSessions?.length || 0,            sub: 'upcoming'            },
  ];

  return (
    <DashboardLayout sidebarLinks={youthSidebarLinks}>
      <div className="space-y-8">

        {/* Header */}
        <div className="border-b border-stone-100 pb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Dashboard</p>
          <h1 className="font-display font-light text-stone-900 text-4xl" style={{ letterSpacing: '-0.022em' }}>
            Welcome back, <em>{user?.firstName}</em>
          </h1>
          <p className="text-stone-400 text-sm mt-2">Here's what's happening with your career search.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-stone-100 divide-x divide-y md:divide-y-0 divide-stone-100">
          {stats.map(({ label, value, sub }) => (
            <div key={label} className="p-6">
              <div className="font-display text-3xl font-light text-stone-900" style={{ letterSpacing: '-0.02em' }}>{value}</div>
              <div className="text-[10px] uppercase tracking-label text-stone-400 mt-1">{label}</div>
              <div className="text-[10px] text-stone-300 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Profile completion nudge */}
        {completionPercentage < 80 && (
          <div className="border-l-2 border-accent pl-5 py-1 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-900">Complete your profile ({completionPercentage}%)</p>
              <p className="text-xs text-stone-400 mt-0.5">Profiles with higher completion get 3× more employer views</p>
            </div>
            <Link to="/youth/profile">
              <Button variant="outline" size="sm">Complete</Button>
            </Link>
          </div>
        )}

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
                      <div className="flex gap-2 flex-shrink-0 ml-4">
                        <Badge variant="primary">{job.type}</Badge>
                      </div>
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
                        <p className="text-sm font-medium text-stone-900">{app.job.title}</p>
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
                      <p className="text-xs text-stone-400 mt-0.5">{course.lessons.length} lessons</p>
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
                      with {session.mentor.firstName} {session.mentor.lastName}
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

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: '/youth/jobs',        label: 'Find Jobs'     },
            { to: '/youth/courses',     label: 'Courses'       },
            { to: '/youth/skill-tests', label: 'Skill Tests'   },
            { to: '/youth/mentorship',  label: 'Find Mentor'   },
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
