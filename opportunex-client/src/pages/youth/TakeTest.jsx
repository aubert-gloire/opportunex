import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Clock, CheckCircle, Award } from 'lucide-react';
import { skillAPI } from '@/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { LoadingScreen } from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';

const TakeTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const { data: testData, isLoading } = useQuery({
    queryKey: ['skillTest', id],
    queryFn: async () => {
      const response = await skillAPI.getSkillTest(id);
      return response.data.test;
    },
  });

  const submitMutation = useMutation({
    mutationFn: (data) => skillAPI.submitTest(id, data),
    onSuccess: (response) => {
      setTestResults(response.data.result);
      setShowResults(true);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit test');
    },
  });

  useEffect(() => {
    if (testStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStarted, timeRemaining]);

  const startTest = () => {
    setTestStarted(true);
    setTimeRemaining(testData.duration * 60);
    setAnswers(new Array(testData.questions.length).fill(null));
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmitTest = () => {
    const formattedAnswers = answers.map((answer, index) => ({
      questionIndex: index,
      selectedAnswer: answer,
    }));

    const timeTaken = (testData.duration * 60) - timeRemaining;

    submitMutation.mutate({
      answers: formattedAnswers,
      timeTaken,
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) return <LoadingScreen message="Loading test..." />;

  if (!testData) return null;

  // Start Screen
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{testData.title}</h1>
              <p className="text-gray-600">{testData.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{testData.questions.length}</p>
                <p className="text-sm text-gray-600">Questions</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{testData.duration}</p>
                <p className="text-sm text-gray-600">Minutes</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{testData.passingScore}%</p>
                <p className="text-sm text-gray-600">To Pass</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Award className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 capitalize">{testData.difficulty}</p>
                <p className="text-sm text-gray-600">Level</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Before you start:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• You have {testData.duration} minutes to complete the test</li>
                <li>• All questions must be answered</li>
                <li>• You can navigate between questions</li>
                <li>• The test will auto-submit when time runs out</li>
                <li>• You can retake the test after 7 days if needed</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => navigate('/youth/skill-tests')} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" onClick={startTest} className="flex-1">
                Start Test
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Test Screen
  const question = testData.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / testData.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Timer and Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {testData.questions.length}
            </span>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-primary" />
              <span className={timeRemaining < 60 ? 'text-red-600' : 'text-primary'}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>

          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${answers[currentQuestion] === index
                    ? 'border-primary bg-primary-50'
                    : 'border-gray-200 hover:border-primary-200 bg-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answers[currentQuestion] === index
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                      }`}
                  >
                    {answers[currentQuestion] === index && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="secondary"
              onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            {currentQuestion === testData.questions.length - 1 ? (
              <Button
                variant="primary"
                onClick={handleSubmitTest}
                disabled={answers.includes(null)}
                loading={submitMutation.isPending}
              >
                Submit Test
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.min(testData.questions.length - 1, prev + 1)
                  )
                }
              >
                Next
              </Button>
            )}
          </div>
        </Card>

        {/* Question Navigation */}
        <Card className="mt-4">
          <div className="flex flex-wrap gap-2">
            {testData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${index === currentQuestion
                    ? 'bg-primary text-white'
                    : answers[index] !== null
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Results Modal */}
      <Modal
        isOpen={showResults}
        onClose={() => {
          setShowResults(false);
          navigate('/youth/skill-tests');
        }}
        title={testResults?.passed ? 'Congratulations!' : 'Test Completed'}
        closeOnOverlayClick={false}
      >
        {testResults && (
          <div className="text-center space-y-6">
            <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${testResults.passed ? 'bg-green-100' : 'bg-gray-100'
              }`}>
              <Award className={`w-12 h-12 ${testResults.passed ? 'text-green-600' : 'text-gray-400'}`} />
            </div>

            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {testResults.percentage}%
              </h3>
              <p className="text-gray-600">
                {testResults.correctAnswers} out of {testResults.totalQuestions} correct
              </p>
            </div>

            {testResults.passed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-900 font-semibold mb-2">You passed the test!</p>
                <p className="text-green-700 text-sm">
                  A {testResults.badge} badge has been added to your profile
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-900 font-semibold mb-2">Keep practicing!</p>
                <p className="text-gray-700 text-sm">
                  You can retake this test after 7 days
                </p>
              </div>
            )}

            <Button
              variant="primary"
              onClick={() => navigate('/youth/skill-tests')}
              className="w-full"
            >
              Back to Skill Tests
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TakeTest;
