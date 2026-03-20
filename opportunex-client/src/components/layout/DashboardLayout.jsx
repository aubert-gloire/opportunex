import Sidebar from './Sidebar';

const DashboardLayout = ({ children, sidebarLinks }) => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar links={sidebarLinks} />
      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
