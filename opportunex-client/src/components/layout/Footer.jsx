import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const col = 'text-[10px] uppercase tracking-luxury text-white/40 font-medium mb-5';
  const item = 'text-sm text-white/50 hover:text-white/80 transition-colors duration-150';

  return (
    <footer className="bg-primary mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="font-display text-2xl italic text-white block mb-4">
              OpportuneX
            </Link>
            <p className="text-sm text-white/40 leading-relaxed font-light">
              Bridging Rwanda's employment–education gap through mentorship, skill verification, and intelligent matching.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className={col}>Platform</p>
            <ul className="space-y-3">
              <li><Link to="/jobs" className={item}>Browse Jobs</Link></li>
              <li><Link to="/about" className={item}>About Us</Link></li>
              <li><Link to="/register" className={item}>Register</Link></li>
              <li><Link to="/login" className={item}>Sign In</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <p className={col}>For Employers</p>
            <ul className="space-y-3">
              <li><Link to="/employer/post-job" className={item}>Post a Job</Link></li>
              <li><Link to="/employer/talent-search" className={item}>Search Talent</Link></li>
              <li><Link to="/employer/subscription" className={item}>Pricing</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className={col}>Contact</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                <a href="mailto:info@opportunex.rw" className={item}>info@opportunex.rw</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                <span className="text-sm text-white/50">+250 788 123 456</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                <span className="text-sm text-white/50">Kigali, Rwanda</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-label text-white/25">
            &copy; {new Date().getFullYear()} OpportuneX. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link to="/privacy" className="text-[10px] uppercase tracking-label text-white/25 hover:text-white/50 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-[10px] uppercase tracking-label text-white/25 hover:text-white/50 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
