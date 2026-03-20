import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Building2,
  CreditCard,
  Upload,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { userAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Avatar from '@/components/ui/Avatar';
import { SECTORS, COMPANY_SIZES } from '@/utils/constants';
import { useAuth } from '@/context/AuthContext';

const employerSidebarLinks = [
  { path: '/employer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/employer/post-job', label: 'Post a Job', icon: <Briefcase className="w-5 h-5" /> },
  { path: '/employer/my-postings', label: 'My Postings', icon: <FileText className="w-5 h-5" /> },
  { path: '/employer/talent-search', label: 'Search Talent', icon: <Users className="w-5 h-5" /> },
  { path: '/employer/subscription', label: 'Subscription', icon: <CreditCard className="w-5 h-5" /> },
  { path: '/employer/profile', label: 'Company Profile', icon: <Building2 className="w-5 h-5" /> },
];

const EmployerProfile = () => {
  const { user, updateUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  const { data: profileData, refetch } = useQuery({
    queryKey: ['employerProfile'],
    queryFn: async () => {
      const response = await userAPI.getProfile();
      return response.data;
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    values: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: profileData?.user?.phone || '',
      companyName: profileData?.profile?.companyName || '',
      industry: profileData?.profile?.industry || '',
      companySize: profileData?.profile?.companySize || '',
      description: profileData?.profile?.description || '',
      website: profileData?.profile?.website || '',
      location: profileData?.profile?.location || 'Kigali',
      contactEmail: profileData?.profile?.contactEmail || '',
      contactPhone: profileData?.profile?.contactPhone || '',
      tinNumber: profileData?.profile?.tinNumber || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await userAPI.updateProfile(data);
      toast.success('Profile updated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const response = await userAPI.uploadAvatar(formData);
      updateUser({ ...user, avatar: response.data.avatar });
      toast.success('Logo updated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout sidebarLinks={employerSidebarLinks}>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Profile</h1>
          <p className="text-gray-600">Manage your company information</p>
        </div>

        {/* Company Logo */}
        <Card>
          <CardHeader>
            <CardTitle>Company Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar
                src={user?.avatar}
                firstName={profileData?.profile?.companyName || 'Company'}
                lastName=""
                size="2xl"
              />
              <div>
                <label htmlFor="logo-upload">
                  <Button variant="primary" disabled={uploading}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Recommended: Square image, at least 400x400px
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact First Name"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  required
                />
                <Input
                  label="Contact Last Name"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  required
                />
              </div>

              <Input
                label="Company Name"
                {...register('companyName')}
                error={errors.companyName?.message}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Industry"
                  options={SECTORS}
                  {...register('industry')}
                  error={errors.industry?.message}
                />
                <Select
                  label="Company Size"
                  options={COMPANY_SIZES}
                  {...register('companySize')}
                  error={errors.companySize?.message}
                />
              </div>

              <Textarea
                label="Company Description"
                rows={5}
                placeholder="Tell candidates about your company..."
                {...register('description')}
                error={errors.description?.message}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Website"
                  type="url"
                  placeholder="https://yourcompany.com"
                  {...register('website')}
                  error={errors.website?.message}
                />
                <Input
                  label="Location"
                  {...register('location')}
                  error={errors.location?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  type="email"
                  {...register('contactEmail')}
                  error={errors.contactEmail?.message}
                />
                <Input
                  label="Contact Phone"
                  type="tel"
                  {...register('contactPhone')}
                  error={errors.contactPhone?.message}
                />
              </div>

              <Input
                label="TIN Number (Rwanda Tax ID)"
                {...register('tinNumber')}
                error={errors.tinNumber?.message}
              />

              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployerProfile;
