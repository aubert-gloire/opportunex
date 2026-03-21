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
  { path: '/youth/dashboard', label: 'Dashboard', icon: <BookOpen className="w-4 h-4" /> },
  { path: '/youth/courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
  { path: '/youth/my-courses', label: 'My Courses', icon: <BookOpen className="w-4 h-4" /> },
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
        <div className="border-b border-stone-100 pb-8 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Learning</p>
            <h1 className="font-display font-light text-stone-900 text-3xl sm:text-4xl" style={{ letterSpacing: '-0.022em' }}>My Courses</h1>
            <p className="text-stone-400 text-sm mt-2">Track your learning progress</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/youth/courses')} className="self-start sm:self-auto">
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
                  <Skeleton className="w-24 h-24" />
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
                <Card key={enrollment._id} hover>
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Course Thumbnail */}
                      <div className="w-24 h-24 flex-shrink-0">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-stone-300" />
                          </div>
                        )}
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-light text-stone-900 line-clamp-1" style={{ letterSpacing: '-0.01em' }}>
                            {course.title}
                          </h3>
                          {getStatusBadge(enrollment.status)}
                        </div>

                        <p className="text-sm text-stone-400 mb-3 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-stone-400 text-xs">Progress</span>
                            <span className="font-light text-primary text-xs">
                              {enrollment.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-stone-100 h-0.5">
                            <div
                              className="bg-primary h-0.5 transition-all"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-stone-400 mt-1">
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
                              >
                                Review Course
                              </Button>
                              {enrollment.certificateIssued && (
                                <Button
                                  variant="accent"
                                  size="sm"
                                  onClick={() => navigate(`/youth/certificate/${course._id}`)}
                                >
                                  Certificate
                                </Button>
                              )}
                            </>
                          ) : (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => navigate(`/youth/courses/${course._id}/learn`)}
                            >
                              {enrollment.progress > 0 ? 'Continue' : 'Start Course'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Stats */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-stone-50 text-sm text-stone-400">
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
            icon={BookOpen}
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
