import { NavLink } from 'react-router-dom';

const Sidebar = ({ links }) => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            {link.icon}
            <span className="font-medium">{link.label}</span>
            {link.badge && (
              <span className="ml-auto bg-accent text-white text-xs px-2 py-0.5 rounded-full">
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
