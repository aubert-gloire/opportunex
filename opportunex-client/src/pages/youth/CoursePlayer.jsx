import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Clock,
  CheckCircle,
  Circle,
  ChevronLeft,
  ChevronRight,
  Award,
  Star,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { courseAPI } from '@/api';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import Modal from '@/components/ui/Modal';
import Textarea from '@/components/ui/Textarea';
import Rating from '@/components/ui/Rating';
import { formatDuration } from '@/utils/helpers';
import { toast } from 'react-hot-toast';

const CoursePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const response = await courseAPI.getCourse(id);
      return response.data;
    },
  });

  const { data: progressData } = useQuery({
    queryKey: ['course-progress', id],
    queryFn: async () => {
      const response = await courseAPI.getCourseProgress(id);
      return response.data.enrollment;
    },
    enabled: !!data?.enrollment,
  });

  const markCompleteMutation = useMutation({
    mutationFn: (lessonId) => courseAPI.markLessonComplete(id, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries(['course', id]);
      queryClient.invalidateQueries(['course-progress', id]);
      queryClient.invalidateQueries(['my-courses']);
      toast.success('Lesson marked as complete!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to mark lesson complete');
    },
  });

  const ratingMutation = useMutation({
    mutationFn: (data) => courseAPI.rateCourse(id, data),
    onSuccess: () => {
      toast.success('Thank you for rating this course!');
      setShowRatingModal(false);
      queryClient.invalidateQueries(['course', id]);
      queryClient.invalidateQueries(['course-progress', id]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    },
  });

  const course = data?.course;
  const enrollment = progressData || data?.enrollment;

  useEffect(() => {
    if (enrollment?.currentLesson) {
      setCurrentLessonIndex(enrollment.currentLesson);
    }
  }, [enrollment]);

  // Check if course is completed and show rating modal
  useEffect(() => {
    if (enrollment?.status === 'completed' && !enrollment?.rating?.score) {
      setTimeout(() => setShowRatingModal(true), 1000);
    }
  }, [enrollment]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <Skeleton className="h-96 mb-6" />
          <div className="flex gap-6">
            <Skeleton className="flex-1 h-64" />
            <Skeleton className="w-80 h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!course || !enrollment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Course not found or you're not enrolled</p>
          <Button variant="primary" onClick={() => navigate('/youth/courses')}>
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }

  const sortedLessons = [...course.lessons].sort((a, b) => a.order - b.order);
  const currentLesson = sortedLessons[currentLessonIndex];
  const isLastLesson = currentLessonIndex === sortedLessons.length - 1;
  const isFirstLesson = currentLessonIndex === 0;

  const isLessonCompleted = (lessonId) => {
    return enrollment.completedLessons?.some(
      (cl) => cl.lessonId.toString() === lessonId.toString()
    );
  };

  const handleMarkComplete = () => {
    markCompleteMutation.mutate(currentLesson._id);
  };

  const handleNextLesson = () => {
    if (!isLastLesson) {
      // Mark current as complete if not already
      if (!isLessonCompleted(currentLesson._id)) {
        markCompleteMutation.mutate(currentLesson._id);
      }
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (!isFirstLesson) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleSubmitRating = () => {
    ratingMutation.mutate({ score: rating, review });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/youth/my-courses')}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">
                  Lesson {currentLessonIndex + 1} of {sortedLessons.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">
                {enrollment.progress}% Complete
              </span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Video Player & Content */}
          <div className="flex-1">
            <Card className="mb-6">
              {/* Video Player */}
              {currentLesson.videoUrl ? (
                <div className="aspect-video bg-black rounded-t-lg">
                  <iframe
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    className="w-full h-full rounded-t-lg"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary to-primary-dark rounded-t-lg flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-white opacity-50" />
                </div>
              )}

              {/* Lesson Info */}
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {currentLesson.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{currentLesson.duration} minutes</span>
                      </div>
                    </div>
                  </div>
                  {isLessonCompleted(currentLesson._id) ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </Badge>
                  ) : (
                    <Button
                      variant="success"
                      onClick={handleMarkComplete}
                      disabled={markCompleteMutation.isPending}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark Complete
                    </Button>
                  )}
                </div>

                <p className="text-gray-700 mb-6 whitespace-pre-wrap">
                  {currentLesson.description}
                </p>

                {/* Lesson Content */}
                {currentLesson.content && (
                  <div className="prose max-w-none mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{currentLesson.content}</p>
                    </div>
                  </div>
                )}

                {/* Resources */}
                {currentLesson.resources && currentLesson.resources.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Lesson Resources
                    </h3>
                    <div className="space-y-2">
                      {currentLesson.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            <span className="text-gray-900">{resource.title}</span>
                            <Badge variant="secondary">{resource.type}</Badge>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePreviousLesson}
                    disabled={isFirstLesson}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous Lesson
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleNextLesson}
                    disabled={isLastLesson}
                    className="flex items-center gap-2"
                  >
                    Next Lesson
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course Completion */}
            {enrollment.status === 'completed' && (
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Award className="w-10 h-10" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">Congratulations!</h3>
                      <p className="text-white/90">
                        You've completed this course. Your certificate is ready!
                      </p>
                    </div>
                    <Button
                      variant="accent"
                      onClick={() => setShowRatingModal(true)}
                      className="flex items-center gap-2"
                    >
                      <Star className="w-5 h-5" />
                      Rate Course
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Course Curriculum */}
          <div className="lg:w-80">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Course Content
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {enrollment.completedLessons?.length || 0} / {sortedLessons.length} completed
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {sortedLessons.map((lesson, index) => {
                    const completed = isLessonCompleted(lesson._id);
                    const isCurrent = index === currentLessonIndex;

                    return (
                      <div
                        key={lesson._id}
                        onClick={() => setCurrentLessonIndex(index)}
                        className={`p-3 rounded-lg cursor-pointer transition ${isCurrent
                            ? 'bg-primary text-white'
                            : completed
                              ? 'bg-green-50 hover:bg-green-100'
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 mt-1">
                            {completed ? (
                              <CheckCircle className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-green-500'}`} />
                            ) : (
                              <Circle className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-gray-400'}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium mb-1 ${isCurrent ? 'text-white' : 'text-gray-900'}`}>
                              {index + 1}. {lesson.title}
                            </p>
                            <div className="flex items-center gap-2">
                              <Clock className={`w-3 h-3 ${isCurrent ? 'text-white/70' : 'text-gray-500'}`} />
                              <span className={`text-xs ${isCurrent ? 'text-white/70' : 'text-gray-500'}`}>
                                {lesson.duration} min
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <Modal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        title="Rate This Course"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <Rating rating={rating} onChange={setRating} size="lg" readonly={false} showNumber={false} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review (Optional)
            </label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this course..."
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowRatingModal(false)}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitRating}
              disabled={ratingMutation.isPending}
              className="flex-1"
            >
              {ratingMutation.isPending ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CoursePlayer;
