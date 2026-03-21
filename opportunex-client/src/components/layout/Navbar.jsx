import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

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
    const map = { youth: '/youth/dashboard', employer: '/employer/dashboard', admin: '/admin/dashboard' };
    return map[user.role] || '/';
  };

  const navLink = 'text-[11px] uppercase tracking-label text-stone-500 hover:text-stone-900 transition-colors duration-150 font-medium';

  return (
    <nav className="bg-white border-b border-stone-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between items-center h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo size="sm" variant="dark" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isAuthenticated ? (
              <>
                <Link to="/jobs" className={navLink}>Browse Jobs</Link>
                <Link to="/about" className={navLink}>About</Link>
                <div className="w-px h-4 bg-stone-200 mx-1" />
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to={getDashboardLink()} className={navLink}>
                  Dashboard
                </Link>

                {user.role === 'youth' && (
                  <Link to="/youth/jobs" className={navLink}>Find Jobs</Link>
                )}

                {user.role === 'employer' && (
                  <Link to="/employer/post-job" className={navLink}>Post a Job</Link>
                )}

                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-stone-100">
                  <Link to={`${getDashboardLink().split('/dashboard')[0]}/profile`}>
                    <Avatar
                      src={user.avatar}
                      firstName={user.firstName}
                      lastName={user.lastName}
                      size="sm"
                      className="cursor-pointer hover:ring-1 hover:ring-primary transition-all"
                    />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-stone-400 hover:text-red-500 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-stone-600 hover:text-stone-900"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-5 border-t border-stone-100 space-y-1">
            {!isAuthenticated ? (
              <>
                <Link to="/jobs" className="block py-2.5 text-[11px] uppercase tracking-label text-stone-500" onClick={() => setIsMenuOpen(false)}>Browse Jobs</Link>
                <Link to="/about" className="block py-2.5 text-[11px] uppercase tracking-label text-stone-500" onClick={() => setIsMenuOpen(false)}>About</Link>
                <div className="pt-3 space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" className="w-full">Get Started</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link to={getDashboardLink()} className="flex items-center gap-2 py-2.5 text-[11px] uppercase tracking-label text-stone-500" onClick={() => setIsMenuOpen(false)}>
                  <LayoutDashboard className="w-3.5 h-3.5" />Dashboard
                </Link>
                {user?.role === 'youth' && (
                  <Link to="/youth/jobs" className="flex items-center gap-2 py-2.5 text-[11px] uppercase tracking-label text-stone-500" onClick={() => setIsMenuOpen(false)}>
                    Find Jobs
                  </Link>
                )}
                {user?.role === 'employer' && (
                  <Link to="/employer/post-job" className="flex items-center gap-2 py-2.5 text-[11px] uppercase tracking-label text-stone-500" onClick={() => setIsMenuOpen(false)}>
                    Post a Job
                  </Link>
                )}
                <div className="pt-2 border-t border-stone-100">
                  <button onClick={handleLogout} className="flex items-center gap-2 py-2.5 text-[11px] uppercase tracking-label text-red-400 w-full">
                    <LogOut className="w-3.5 h-3.5" />Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
