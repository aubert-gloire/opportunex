import Sidebar from './Sidebar';

const DashboardLayout = ({ children, sidebarLinks }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar links={sidebarLinks} />
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
