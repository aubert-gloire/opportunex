import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { LayoutDashboard, Users, BarChart3, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate } from '@/utils/helpers';

const adminSidebarLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/admin/users', label: 'Manage Users', icon: <Users className="w-4 h-4" /> },
  { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
];

const ManageUsers = () => {
  const [filters, setFilters] = useState({
    role: '',
    search: '',
    isActive: '',
  });

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ['allUsers', filters],
    queryFn: async () => {
      const response = await adminAPI.getAllUsers(filters);
      return response.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => adminAPI.updateUserStatus(id, isActive),
    onSuccess: () => {
      toast.success('User status updated');
      refetch();
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  const verifyEmployerMutation = useMutation({
    mutationFn: (id) => adminAPI.verifyEmployer(id),
    onSuccess: () => {
      toast.success('Employer verified');
      refetch();
    },
    onError: () => {
      toast.error('Failed to verify employer');
    },
  });

  return (
    <DashboardLayout sidebarLinks={adminSidebarLinks}>
      <div className="space-y-6">
        <div className="border-b border-stone-100 pb-8 mb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Administration</p>
          <h1 className="font-display font-light text-stone-900 text-3xl sm:text-4xl" style={{ letterSpacing: '-0.022em' }}>Manage Users</h1>
          <p className="text-stone-400 text-sm mt-2">View and manage platform users</p>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <Select
              placeholder="All Roles"
              options={[
                { value: '', label: 'All Roles' },
                { value: 'youth', label: 'Youth' },
                { value: 'employer', label: 'Employer' },
                { value: 'admin', label: 'Admin' },
              ]}
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            />
            <Select
              placeholder="All Status"
              options={[
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
            />
          </div>
        </Card>

        {/* Users Table */}
        {isLoading ? (
          <p className="text-stone-400 text-sm">Loading users...</p>
        ) : usersData?.users.length === 0 ? (
          <EmptyState icon={Users} title="No users found" description="Try adjusting your filters" />
        ) : (
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-[10px] uppercase tracking-label text-stone-400">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] uppercase tracking-label text-stone-400">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] uppercase tracking-label text-stone-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] uppercase tracking-label text-stone-400">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-[10px] uppercase tracking-label text-stone-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {usersData?.users.map((user) => (
                    <tr key={user._id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.avatar}
                            firstName={user.firstName}
                            lastName={user.lastName}
                            size="sm"
                          />
                          <div>
                            <p className="font-light text-stone-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-stone-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="primary" className="capitalize">
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={user.isActive ? 'success' : 'danger'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            variant={user.isActive ? 'danger' : 'success'}
                            size="sm"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: user._id,
                                isActive: !user.isActive,
                              })
                            }
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          {user.role === 'employer' && !user.isVerified && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => verifyEmployerMutation.mutate(user._id)}
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
