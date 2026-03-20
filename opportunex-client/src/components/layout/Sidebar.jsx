import { NavLink } from 'react-router-dom';

const Sidebar = ({ links }) => {
  return (
    <aside className="w-56 bg-white border-r border-stone-100 min-h-screen py-8 px-4 flex-shrink-0">
      <nav className="space-y-0.5">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
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
  );
};

export default Sidebar;
