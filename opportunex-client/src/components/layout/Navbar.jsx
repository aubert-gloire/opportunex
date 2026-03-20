import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Briefcase, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
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
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-xl md:text-2xl font-display font-bold text-primary tracking-tight">OpportuneX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <Link to="/jobs" className="text-gray-700 hover:text-primary transition-colors font-medium">
                  Browse Jobs
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-primary transition-colors font-medium">
                  About
                </Link>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="accent">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getDashboardLink()}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {user.role === 'youth' && (
                  <Link to="/youth/jobs" className="text-gray-700 hover:text-primary transition-colors font-medium">
                    Find Jobs
                  </Link>
                )}

                {user.role === 'employer' && (
                  <Link to="/employer/post-job" className="text-gray-700 hover:text-primary transition-colors font-medium">
                    Post Job
                  </Link>
                )}

                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                  <Link to={`${getDashboardLink().split('/dashboard')[0]}/profile`}>
                    <Avatar
                      src={user.avatar}
                      firstName={user.firstName}
                      lastName={user.lastName}
                      size="md"
                      className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/jobs"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/about"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="accent" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to={getDashboardLink()}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
