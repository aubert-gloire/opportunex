import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, PlayCircle, CheckCircle, Award } from 'lucide-react';
import { courseAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { formatDuration, formatDate } from '@/utils/helpers';

const youthSidebarLinks = [
  { path: '/youth/dashboard', label: 'Dashboard', icon: <BookOpen className="w-5 h-5" /> },
  { path: '/youth/courses', label: 'Courses', icon: <BookOpen className="w-5 h-5" /> },
  { path: '/youth/my-courses', label: 'My Courses', icon: <BookOpen className="w-5 h-5" /> },
];

const MyCourses = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => {
      const response = await courseAPI.getMyCourses();
      return response.data.enrollments;
    },
  });

  const filteredEnrollments = enrollments?.filter((enrollment) => {
    if (statusFilter === 'all') return true;
    return enrollment.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      enrolled: { variant: 'secondary', label: 'Enrolled' },
      'in-progress': { variant: 'primary', label: 'In Progress' },
      completed: { variant: 'success', label: 'Completed' },
      dropped: { variant: 'danger', label: 'Dropped' },
    };
    const config = statusConfig[status] || statusConfig.enrolled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <DashboardLayout sidebarLinks={youthSidebarLinks}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
            <p className="text-gray-600">Track your learning progress</p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/youth/courses')}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Browse Courses
          </Button>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { value: 'all', label: 'All Courses' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'enrolled', label: 'Not Started' },
          ].map((filter) => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(filter.value)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Courses List */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <div className="flex gap-4 p-6">
                  <Skeleton className="w-24 h-24 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-6 mb-2 w-3/4" />
                    <Skeleton className="h-4 mb-3 w-full" />
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredEnrollments && filteredEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEnrollments.map((enrollment) => {
              const course = enrollment.course;

              return (
                <Card key={enrollment._id} className="hover:shadow-lg transition">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      {/* Course Thumbnail */}
                      <div className="w-24 h-24 flex-shrink-0">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-white opacity-70" />
                          </div>
                        )}
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {course.title}
                          </h3>
                          {getStatusBadge(enrollment.status)}
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-primary">
                              {enrollment.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {enrollment.completedLessons.length} of {course.lessons.length} lessons completed
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {enrollment.status === 'completed' ? (
                            <>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => navigate(`/youth/courses/${course._id}/learn`)}
                                className="flex items-center gap-1"
                              >
                                <PlayCircle className="w-4 h-4" />
                                Review Course
                              </Button>
                              {enrollment.certificateUrl && (
                                <Button
                                  variant="accent"
                                  size="sm"
                                  onClick={() => window.open(enrollment.certificateUrl, '_blank')}
                                  className="flex items-center gap-1"
                                >
                                  <Award className="w-4 h-4" />
                                  Certificate
                                </Button>
                              )}
                            </>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => navigate(`/youth/courses/${course._id}/learn`)}
                              className="flex items-center gap-1"
                            >
                              <PlayCircle className="w-4 h-4" />
                              {enrollment.progress > 0 ? 'Continue' : 'Start Course'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-gray-600">
                      <span>Enrolled {formatDate(enrollment.enrolledAt)}</span>
                      {enrollment.completedAt && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Completed {formatDate(enrollment.completedAt)}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen className="w-16 h-16" />}
            title="No enrolled courses"
            description="Start learning by browsing available courses"
            action={
              <Button
                variant="primary"
                onClick={() => navigate('/youth/courses')}
                className="mt-4"
              >
                Browse Courses
              </Button>
            }
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyCourses;
