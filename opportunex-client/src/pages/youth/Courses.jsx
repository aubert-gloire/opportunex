import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Users, Star, Search, Filter } from 'lucide-react';
import { courseAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { formatDuration } from '@/utils/helpers';
import { SECTORS } from '@/utils/constants';

const youthSidebarLinks = [
  { path: '/youth/dashboard', label: 'Dashboard', icon: <BookOpen className="w-5 h-5" /> },
  { path: '/youth/profile', label: 'My Profile', icon: <Users className="w-5 h-5" /> },
  { path: '/youth/courses', label: 'Courses', icon: <BookOpen className="w-5 h-5" /> },
  { path: '/youth/my-courses', label: 'My Courses', icon: <BookOpen className="w-5 h-5" /> },
];

const Courses = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sector: '',
    level: '',
    isFree: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['courses', filters],
    queryFn: async () => {
      const response = await courseAPI.getCourses(filters);
      return response.data.courses;
    },
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout sidebarLinks={youthSidebarLinks}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
          <p className="text-gray-600">Learn new skills and advance your career</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search courses..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Business">Business</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
              </Select>
              <Select
                value={filters.sector}
                onChange={(e) => handleFilterChange('sector', e.target.value)}
              >
                <option value="">All Sectors</option>
                {SECTORS.map((sector) => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </Select>
              <Select
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
              <Select
                value={filters.isFree}
                onChange={(e) => handleFilterChange('isFree', e.target.value)}
              >
                <option value="">All Courses</option>
                <option value="true">Free Only</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 rounded-t-lg" />
                <CardContent className="pt-4">
                  <Skeleton className="h-6 mb-2" />
                  <Skeleton className="h-4 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((course) => (
              <Card
                key={course._id}
                className="hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/youth/courses/${course._id}`)}
              >
                <div className="relative">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center rounded-t-lg">
                      <BookOpen className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  {course.price === 0 && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Free
                    </span>
                  )}
                </div>

                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(course.totalDuration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.enrollmentCount} enrolled</span>
                    </div>
                    {course.rating.count > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating.average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="primary">{course.category}</Badge>
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      By {course.instructor.name}
                    </span>
                    {course.price > 0 && (
                      <span className="text-lg font-bold text-primary">
                        {course.price.toLocaleString()} {course.currency}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<BookOpen className="w-16 h-16" />}
            title="No courses found"
            description="Try adjusting your filters to see more courses"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Courses;
