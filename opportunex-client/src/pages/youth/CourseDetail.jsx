import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Clock,
  Users,
  Award,
  PlayCircle,
  CheckCircle,
  Star,
  ArrowLeft,
} from 'lucide-react';
import { courseAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Skeleton from '@/components/ui/Skeleton';
import { formatDuration } from '@/utils/helpers';
import { toast } from 'react-hot-toast';

const youthSidebarLinks = [
  { path: '/youth/dashboard', label: 'Dashboard', icon: <BookOpen className="w-5 h-5" /> },
  { path: '/youth/courses', label: 'Courses', icon: <BookOpen className="w-5 h-5" /> },
];

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await courseAPI.getCourse(id);
      return response.data;
    },
  });

  const enrollMutation = useMutation({
    mutationFn: () => courseAPI.enrollInCourse(id),
    onSuccess: () => {
      toast.success('Successfully enrolled in course!');
      queryClient.invalidateQueries(['course', id]);
      queryClient.invalidateQueries(['my-courses']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    },
  });

  const handleEnroll = () => {
    if (data?.course?.price > 0) {
      toast.error('Paid courses not yet supported');
      return;
    }
    enrollMutation.mutate();
  };

  const handleStartCourse = () => {
    navigate(`/youth/courses/${id}/learn`);
  };

  if (isLoading) {
    return (
      <DashboardLayout sidebarLinks={youthSidebarLinks}>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
        </div>
      </DashboardLayout>
    );
  }

  const { course, enrollment } = data || {};

  if (!course) {
    return (
      <DashboardLayout sidebarLinks={youthSidebarLinks}>
        <div className="text-center py-12">
          <p className="text-gray-600">Course not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const isEnrolled = !!enrollment;

  return (
    <DashboardLayout sidebarLinks={youthSidebarLinks}>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/youth/courses')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Button>

        {/* Course Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="accent">{course.category}</Badge>
                <Badge variant="secondary">{course.level}</Badge>
                {course.price === 0 && <Badge variant="success">Free</Badge>}
              </div>
              <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
              <p className="text-white/90 mb-4">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{formatDuration(course.totalDuration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{course.enrollmentCount} students</span>
                </div>
                {course.rating.count > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating.average.toFixed(1)} ({course.rating.count} ratings)</span>
                  </div>
                )}
              </div>

              {isEnrolled ? (
                <div className="flex items-center gap-3">
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={handleStartCourse}
                    className="flex items-center gap-2"
                  >
                    {enrollment.progress > 0 ? (
                      <>
                        <PlayCircle className="w-5 h-5" />
                        Continue Learning ({enrollment.progress}% complete)
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-5 h-5" />
                        Start Course
                      </>
                    )}
                  </Button>
                  {enrollment.status === 'completed' && (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </Badge>
                  )}
                </div>
              ) : (
                <Button
                  variant="accent"
                  size="lg"
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                </Button>
              )}
            </div>

            {/* Instructor Card */}
            <Card className="lg:w-80 bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6">
                <h3 className="text-white font-semibold mb-3">Instructor</h3>
                <div className="flex items-start gap-3">
                  <Avatar
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-12 h-12"
                  />
                  <div>
                    <p className="text-white font-medium">{course.instructor.name}</p>
                    <p className="text-white/70 text-sm">{course.instructor.title}</p>
                  </div>
                </div>
                {course.instructor.bio && (
                  <p className="text-white/80 text-sm mt-3">{course.instructor.bio}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What You'll Learn */}
        {course.learningOutcomes && course.learningOutcomes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{outcome}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Skills Covered */}
        {course.skills && course.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Skills You'll Gain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {course.skills.map((skill, index) => (
                  <Badge key={index} variant="primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Course Content */}
        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
            <p className="text-gray-600 text-sm">
              {course.lessons.length} lessons • {formatDuration(course.totalDuration)} total
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {course.lessons
                .sort((a, b) => a.order - b.order)
                .map((lesson, index) => {
                  const isCompleted = enrollment?.completedLessons?.some(
                    (cl) => cl.lessonId.toString() === lesson._id.toString()
                  );

                  return (
                    <div
                      key={lesson._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <PlayCircle className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {index + 1}. {lesson.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{lesson.duration} min</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Prerequisites */}
        {course.prerequisites && course.prerequisites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Prerequisites</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {course.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-primary">•</span>
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Certificate Info */}
        {course.certificate.enabled && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Certificate of Completion</h3>
                  <p className="text-sm text-gray-600">
                    Complete {course.certificate.passingPercentage}% of this course to earn your certificate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CourseDetail;
