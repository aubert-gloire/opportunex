import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  GraduationCap,
  User,
  TrendingUp,
  CheckCircle,
  Clock,
  BookOpen,
  PlayCircle,
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
  { path: '/youth/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/youth/jobs', label: 'Find Jobs', icon: <Briefcase className="w-5 h-5" /> },
  { path: '/youth/applications', label: 'My Applications', icon: <FileText className="w-5 h-5" /> },
  { path: '/youth/courses', label: 'Courses', icon: <BookOpen className="w-5 h-5" /> },
  { path: '/youth/my-courses', label: 'My Courses', icon: <BookOpen className="w-5 h-5" /> },
  { path: '/youth/mentorship', label: 'Mentorship', icon: <Users className="w-5 h-5" /> },
  { path: '/youth/skill-tests', label: 'Skill Tests', icon: <GraduationCap className="w-5 h-5" /> },
  { path: '/youth/profile', label: 'My Profile', icon: <User className="w-5 h-5" /> },
];

const YouthDashboard = () => {
  const { user } = useAuth();

  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await userAPI.getProfile();
      return response.data;
    },
  });

  const { data: recommendedJobs } = useQuery({
    queryKey: ['recommendedJobs'],
    queryFn: async () => {
      const response = await jobAPI.getRecommendedJobs();
      return response.data.jobs.slice(0, 5);
    },
  });

  const { data: recentApplications } = useQuery({
    queryKey: ['recentApplications'],
    queryFn: async () => {
      const response = await applicationAPI.getMyApplications({ limit: 5 });
      return response.data.applications;
    },
  });

  const { data: upcomingSessions } = useQuery({
    queryKey: ['upcomingSessions'],
    queryFn: async () => {
      const response = await mentorshipAPI.getMySessions({
        role: 'mentee',
        status: 'confirmed',
      });
      return response.data.sessions.slice(0, 3);
    },
  });

  const { data: myCourses } = useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => {
      const response = await courseAPI.getMyCourses();
      return response.data.enrollments.slice(0, 3);
    },
  });

  const { data: recommendedCourses } = useQuery({
    queryKey: ['recommended-courses'],
    queryFn: async () => {
      const response = await courseAPI.getRecommendedCourses();
      return response.data.courses.slice(0, 3);
    },
  });

  const profile = profileData?.profile;
  const completionPercentage = profile?.profileCompletionPercentage || 0;

  return (
    <DashboardLayout sidebarLinks={youthSidebarLinks}>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your job search</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 text-sm mb-1">Profile Completion</p>
                <p className="text-3xl font-bold">{completionPercentage}%</p>
              </div>
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Applications</p>
                <p className="text-3xl font-bold text-gray-900">
                  {recentApplications?.length || 0}
                </p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Verified Skills</p>
                <p className="text-3xl font-bold text-gray-900">
                  {profile?.verifiedSkills?.length || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Mentorship Sessions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {upcomingSessions?.length || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-accent" />
            </div>
          </Card>
        </div>

        {/* Profile Completion Alert */}
        {completionPercentage < 80 && (
          <Card className="bg-accent-50 border-accent-200">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Complete Your Profile ({completionPercentage}%)
                </h3>
                <p className="text-gray-700 text-sm mb-3">
                  Profiles with higher completion get 3x more employer views
                </p>
                <Link to="/youth/profile">
                  <Button variant="accent" size="sm">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recommended Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendedJobs && recommendedJobs.length > 0 ? (
                <div className="space-y-3">
                  {recommendedJobs.map((job) => (
                    <Link
                      key={job._id}
                      to={`/jobs/${job._id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">{job.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{job.companyName}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="primary" className="text-xs">{job.type}</Badge>
                        <Badge variant="gray" className="text-xs">{job.location}</Badge>
                      </div>
                    </Link>
                  ))}
                  <Link to="/youth/jobs">
                    <Button variant="ghost" className="w-full">
                      View All Jobs
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">
                  Complete your profile to get personalized recommendations
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {recentApplications && recentApplications.length > 0 ? (
                <div className="space-y-3">
                  {recentApplications.map((app) => (
                    <div
                      key={app._id}
                      className="p-3 border border-gray-200 rounded-lg"
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">{app.job.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Applied {formatDate(app.createdAt)}
                      </p>
                      <Badge variant="gray" className={statusColors[app.status]}>
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                  <Link to="/youth/applications">
                    <Button variant="ghost" className="w-full">
                      View All Applications
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-8">
                  No applications yet. Start applying to jobs!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* My Courses / Recommended Courses */}
        <Card>
          <CardHeader>
            <CardTitle>{myCourses && myCourses.length > 0 ? 'Continue Learning' : 'Recommended Courses'}</CardTitle>
          </CardHeader>
          <CardContent>
            {myCourses && myCourses.length > 0 ? (
              <div className="space-y-3">
                {myCourses.map((enrollment) => {
                  const course = enrollment.course;
                  return (
                    <Link
                      key={enrollment._id}
                      to={`/youth/courses/${course._id}/learn`}
                      className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all"
                    >
                      <div className="w-16 h-16 flex-shrink-0">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-white opacity-70" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1">{course.title}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-600">{enrollment.progress}% complete</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[120px]">
                            <div
                              className="bg-primary h-1.5 rounded-full"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>
                        <Badge variant="primary" className="text-xs">{course.category}</Badge>
                      </div>
                      <PlayCircle className="w-6 h-6 text-primary flex-shrink-0" />
                    </Link>
                  );
                })}
                <Link to="/youth/my-courses">
                  <Button variant="ghost" className="w-full">
                    View All My Courses
                  </Button>
                </Link>
              </div>
            ) : recommendedCourses && recommendedCourses.length > 0 ? (
              <div className="space-y-3">
                {recommendedCourses.map((course) => (
                  <Link
                    key={course._id}
                    to={`/youth/courses/${course._id}`}
                    className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all"
                  >
                    <div className="w-16 h-16 flex-shrink-0">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-white opacity-70" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{course.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{course.lessons.length} lessons</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="primary" className="text-xs">{course.category}</Badge>
                        {course.price === 0 && <Badge variant="success" className="text-xs">Free</Badge>}
                      </div>
                    </div>
                  </Link>
                ))}
                <Link to="/youth/courses">
                  <Button variant="ghost" className="w-full">
                    Browse All Courses
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">
                No courses available yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Mentorship Sessions */}
        {upcomingSessions && upcomingSessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Mentorship Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div
                    key={session._id}
                    className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900">{session.topic}</h4>
                      <p className="text-sm text-gray-600">
                        with {session.mentor.firstName} {session.mentor.lastName}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(session.scheduledAt)}
                      </p>
                    </div>
                    <Badge variant="success">{session.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/youth/jobs">
                <Button variant="outline" className="w-full">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Find Jobs
                </Button>
              </Link>
              <Link to="/youth/courses">
                <Button variant="outline" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Courses
                </Button>
              </Link>
              <Link to="/youth/skill-tests">
                <Button variant="outline" className="w-full">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Take Tests
                </Button>
              </Link>
              <Link to="/youth/mentorship">
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Find Mentor
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default YouthDashboard;
