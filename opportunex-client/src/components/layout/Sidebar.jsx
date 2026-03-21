import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';

const Sidebar = ({ links, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-stone-100 z-50 flex flex-col
          transition-transform duration-200 ease-in-out
          lg:static lg:w-56 lg:translate-x-0 lg:flex-shrink-0 lg:min-h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-stone-100 lg:hidden">
          <span className="text-[10px] uppercase tracking-luxury text-stone-400">Menu</span>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-0.5 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 transition-colors duration-150 relative group ${
                  isActive
                    ? 'text-primary border-l-2 border-primary pl-[10px] bg-primary/[0.03]'
                    : 'text-stone-400 hover:text-stone-700 hover:bg-stone-50 border-l-2 border-transparent pl-[10px]'
                }`
              }
            >
              <span className="w-4 h-4 flex-shrink-0 [&>svg]:w-4 [&>svg]:h-4">
                {link.icon}
              </span>
              <span className="text-[11px] uppercase tracking-label font-medium truncate">
                {link.label}
              </span>
              {link.badge && (
                <span className="ml-auto bg-accent text-white text-[10px] px-1.5 py-0.5 font-medium">
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
