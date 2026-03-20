import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/layout/PrivateRoute';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import JobsPublic from './pages/public/JobsPublic';
import JobDetail from './pages/public/JobDetail';
import About from './pages/public/About';
import ResetPassword from './pages/public/ResetPassword';

// Youth Pages
import YouthDashboard from './pages/youth/YouthDashboard';
import YouthProfile from './pages/youth/YouthProfile';
import JobSearch from './pages/youth/JobSearch';
import MyApplications from './pages/youth/MyApplications';
import Mentorship from './pages/youth/Mentorship';
import SkillTests from './pages/youth/SkillTests';
import TakeTest from './pages/youth/TakeTest';
import Courses from './pages/youth/Courses';
import CourseDetail from './pages/youth/CourseDetail';
import MyCourses from './pages/youth/MyCourses';
import CoursePlayer from './pages/youth/CoursePlayer';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerProfile from './pages/employer/EmployerProfile';
import PostJob from './pages/employer/PostJob';
import MyPostings from './pages/employer/MyPostings';
import TalentSearch from './pages/employer/TalentSearch';
import ViewApplications from './pages/employer/ViewApplications';
import Subscription from './pages/employer/Subscription';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import Analytics from './pages/admin/Analytics';

function App() {
  const { isAuthenticated, user } = useAuth();

  // Redirect authenticated users from public pages to their dashboard
  const getDefaultRedirect = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'youth':
        return '/youth/dashboard';
      case 'employer':
        return '/employer/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to={getDefaultRedirect()} replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to={getDefaultRedirect()} replace /> : <Register />}
          />
          <Route path="/jobs" element={<JobsPublic />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Youth Routes */}
          <Route
            path="/youth/dashboard"
            element={
              <PrivateRoute allowedRoles={['youth']}>
                <YouthDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/youth/profile"
            element={
              <PrivateRoute allowedRoles={['youth']}>
                <YouthProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/youth/jobs"
            element={
              <PrivateRoute allowedRoles={['youth']}>
                <JobSearch />
              </PrivateRoute>
            }
          />
          <Route
            path="/youth/applications"
            element={
              <PrivateRoute allowedRoles={['youth']}>
                <MyApplications />
              </PrivateRoute>
            }
          />
          <Route
            path="/youth/mentorship"
            element={
              <PrivateRoute allowedRoles={['youth']}>
                <Mentorship />
              </PrivateRoute>
            }
          />
          <Route
            path="/youth/skill-tests"
            element={
              <PrivateRoute allowedRoles={['youth']}>
                <SkillTests />
              </PrivateRoute>
            }
          />
          <Route
            path="/youth/skill-tests/:id/take"
            element={
              <PrivateRoute allowedRoles={['youth']}>
                <TakeTest />
              </PrivateRoute>
            }
          />
          <Route
            path="/youth/courses"
            element={
              <PrivateRoute allowedRoles={['youth']}>
                <Courses />
              </PrivateRoute>
            }
          />
          <Route
            path="/youth/courses/:id"
            element={
              <PrivateRoute allowedRoles={['youth']}>
                <CourseDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/youth/my-courses"
            element={
              <PrivateRoute allowedRoles={['youth']}>
                <MyCourses />
              </PrivateRoute>
            }
          />
          <Route
            path="/youth/courses/:id/learn"
            element={
              <PrivateRoute allowedRoles={['youth']}>
                <CoursePlayer />
              </PrivateRoute>
            }
          />

          {/* Employer Routes */}
          <Route
            path="/employer/dashboard"
            element={
              <PrivateRoute allowedRoles={['employer']}>
                <EmployerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/employer/profile"
            element={
              <PrivateRoute allowedRoles={['employer']}>
                <EmployerProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/employer/post-job"
            element={
              <PrivateRoute allowedRoles={['employer']}>
                <PostJob />
              </PrivateRoute>
            }
          />
          <Route
            path="/employer/my-postings"
            element={
              <PrivateRoute allowedRoles={['employer']}>
                <MyPostings />
              </PrivateRoute>
            }
          />
          <Route
            path="/employer/talent-search"
            element={
              <PrivateRoute allowedRoles={['employer']}>
                <TalentSearch />
              </PrivateRoute>
            }
          />
          <Route
            path="/employer/applications/:jobId"
            element={
              <PrivateRoute allowedRoles={['employer']}>
                <ViewApplications />
              </PrivateRoute>
            }
          />
          <Route
            path="/employer/subscription"
            element={
              <PrivateRoute allowedRoles={['employer']}>
                <Subscription />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <ManageUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <Analytics />
              </PrivateRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
