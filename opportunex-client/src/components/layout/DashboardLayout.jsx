import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, sidebarLinks }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        links={sidebarLinks}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 overflow-x-hidden">
        {/* Mobile top bar with hamburger */}
        <div className="lg:hidden sticky top-14 z-30 bg-white border-b border-stone-100 px-4 h-12 flex items-center">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[11px] uppercase tracking-label font-medium">Menu</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
