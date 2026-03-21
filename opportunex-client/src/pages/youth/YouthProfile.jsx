import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  GraduationCap,
  User,
  Upload,
  Plus,
  Trash2,
} from 'lucide-react';
import { userAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import { UNIVERSITIES, SECTORS } from '@/utils/constants';
import { useAuth } from '@/context/AuthContext';

const youthSidebarLinks = [
  { path: '/youth/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/youth/jobs', label: 'Find Jobs', icon: <Briefcase className="w-4 h-4" /> },
  { path: '/youth/applications', label: 'My Applications', icon: <FileText className="w-4 h-4" /> },
  { path: '/youth/mentorship', label: 'Mentorship', icon: <Users className="w-4 h-4" /> },
  { path: '/youth/skill-tests', label: 'Skill Tests', icon: <GraduationCap className="w-4 h-4" /> },
  { path: '/youth/profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
];

const YouthProfile = () => {
  const { user, updateUser } = useAuth();
  const [newSkill, setNewSkill] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await userAPI.getProfile();
      return response.data;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    values: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: profileData?.user?.phone || '',
      university: profileData?.profile?.university || '',
      major: profileData?.profile?.major || '',
      graduationYear: profileData?.profile?.graduationYear || '',
      bio: profileData?.profile?.bio || '',
      location: profileData?.profile?.location || 'Kigali',
      preferredSectors: profileData?.profile?.preferredSectors || [],
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => userAPI.updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully');
      refetch();
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setUploading(true);
    try {
      const response = await userAPI.uploadAvatar(formData);
      updateUser({ ...user, avatar: response.data.avatar });
      toast.success('Profile photo updated');
      refetch();
    } catch (error) {
      toast.error('Failed to upload profile photo');
    } finally {
      setUploading(false);
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('cv', file);

    setUploading(true);
    try {
      await userAPI.uploadCV(formData);
      toast.success('CV uploaded successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to upload CV');
    } finally {
      setUploading(false);
    }
  };

  const profile = profileData?.profile;

  return (
    <DashboardLayout sidebarLinks={youthSidebarLinks}>
      <div className="space-y-6">
        <div className="border-b border-stone-100 pb-8 mb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Account</p>
          <h1 className="font-display font-light text-stone-900 text-3xl sm:text-4xl" style={{ letterSpacing: '-0.022em' }}>My Profile</h1>
          <p className="text-stone-400 text-sm mt-2">Manage your professional profile</p>
        </div>

        {/* Profile Header */}
        <Card>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <p className="text-[10px] uppercase tracking-label text-stone-400">Profile Photo</p>
              <div className="relative w-28 h-28">
                <Avatar
                  src={user?.avatar}
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  size="2xl"
                  className="w-28 h-28"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="flex items-center gap-1.5 text-[11px] uppercase tracking-label text-stone-400 hover:text-primary transition-colors cursor-pointer border-b border-stone-200 hover:border-primary pb-px"
              >
                <Upload className="w-3 h-3" />
                {user?.avatar ? 'Change photo' : 'Upload photo'}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Name & Status */}
            <div className="flex-1">
              <h2 className="font-display font-light text-stone-900 text-2xl" style={{ letterSpacing: '-0.022em' }}>
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-stone-400 text-sm mt-0.5">{profile?.major || 'Student'} {profile?.university ? `· ${profile.university}` : ''}</p>
              <div className="mt-3">
                <Badge variant="info">
                  Profile {profile?.profileCompletionPercentage || 0}% Complete
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  required
                />
                <Input
                  label="Last Name"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
                <Input
                  label="Location"
                  {...register('location')}
                  error={errors.location?.message}
                />
                <Select
                  label="University"
                  options={UNIVERSITIES}
                  {...register('university')}
                />
                <Input
                  label="Major"
                  {...register('major')}
                  error={errors.major?.message}
                />
                <Input
                  label="Graduation Year"
                  type="number"
                  {...register('graduationYear', { valueAsNumber: true })}
                  error={errors.graduationYear?.message}
                />
              </div>

              <Textarea
                label="Bio"
                rows={4}
                placeholder="Tell us about yourself..."
                {...register('bio')}
                error={errors.bio?.message}
              />

              <Button type="submit" variant="primary" loading={updateProfileMutation.isPending}>
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* CV Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Resume/CV</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.cv ? (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-stone-900">CV Uploaded</p>
                    <a
                      href={profile.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View CV
                    </a>
                  </div>
                </div>
                <label htmlFor="cv-upload">
                  <Button variant="accent" size="sm" disabled={uploading}>
                    Replace
                  </Button>
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleCVUpload}
                  />
                </label>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-stone-200">
                <FileText className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                <p className="text-stone-400 text-sm mb-4">No CV uploaded yet</p>
                <label htmlFor="cv-upload">
                  <Button variant="primary" disabled={uploading}>
                    Upload CV
                  </Button>
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleCVUpload}
                  />
                </label>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Add Skill */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill (e.g., JavaScript)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="primary"
                  onClick={() => {
                    if (newSkill.trim()) {
                      const currentSkills = profile?.skills || [];
                      updateProfileMutation.mutate({
                        skills: [...currentSkills, newSkill.trim()],
                      });
                      setNewSkill('');
                    }
                  }}
                >
                  Add
                </Button>
              </div>

              {/* Skills List */}
              {profile?.skills && profile.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="primary" className="text-sm py-1 px-3">
                      {skill}
                      <button
                        onClick={() => {
                          const newSkills = profile.skills.filter((_, i) => i !== index);
                          updateProfileMutation.mutate({ skills: newSkills });
                        }}
                        className="ml-2 hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Verified Skills */}
            {profile?.verifiedSkills && profile.verifiedSkills.length > 0 && (
              <div className="mt-6 pt-6 border-t border-stone-100">
                <h4 className="text-[10px] uppercase tracking-label text-stone-400 mb-2.5">Verified Skills</h4>
                <div className="space-y-2">
                  {profile.verifiedSkills.map((vs, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-green-50 border border-green-200"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-stone-900">{vs.skill}</p>
                          <p className="text-sm text-stone-400">Score: {vs.score}%</p>
                        </div>
                      </div>
                      <Badge variant="success">{vs.badge}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default YouthProfile;
