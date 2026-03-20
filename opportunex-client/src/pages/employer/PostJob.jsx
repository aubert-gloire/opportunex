import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Building2,
  CreditCard,
  Plus,
  X,
} from 'lucide-react';
import { jobAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { SECTORS, JOB_TYPES } from '@/utils/constants';

const employerSidebarLinks = [
  { path: '/employer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/employer/post-job', label: 'Post a Job', icon: <Briefcase className="w-4 h-4" /> },
  { path: '/employer/my-postings', label: 'My Postings', icon: <FileText className="w-4 h-4" /> },
  { path: '/employer/talent-search', label: 'Search Talent', icon: <Users className="w-4 h-4" /> },
  { path: '/employer/subscription', label: 'Subscription', icon: <CreditCard className="w-4 h-4" /> },
  { path: '/employer/profile', label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
];

const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  type: z.enum(['full-time', 'part-time', 'internship', 'contract']),
  sector: z.string().min(1, 'Sector is required'),
  location: z.string().min(1, 'Location is required'),
  isRemote: z.boolean().optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  applicationDeadline: z.string().optional(),
});

const PostJob = () => {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState(['']);
  const [skills, setSkills] = useState(['']);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      isRemote: false,
      location: 'Kigali',
    },
  });

  const createJobMutation = useMutation({
    mutationFn: (data) => jobAPI.createJob(data),
    onSuccess: () => {
      toast.success('Job posted successfully!');
      navigate('/employer/my-postings');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create job');
    },
  });

  const onSubmit = (data) => {
    const jobData = {
      ...data,
      requirements: requirements.filter((r) => r.trim() !== ''),
      requiredSkills: skills.filter((s) => s.trim() !== ''),
      salaryRange: {
        min: data.salaryMin || 0,
        max: data.salaryMax || 0,
        currency: 'RWF',
      },
    };

    delete jobData.salaryMin;
    delete jobData.salaryMax;

    createJobMutation.mutate(jobData);
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index, value) => {
    const newReqs = [...requirements];
    newReqs[index] = value;
    setRequirements(newReqs);
  };

  const addSkill = () => {
    setSkills([...skills, '']);
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkill = (index, value) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  return (
    <DashboardLayout sidebarLinks={employerSidebarLinks}>
      <div className="max-w-4xl space-y-6">
        <div className="border-b border-stone-100 pb-8 mb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Recruiting</p>
          <h1 className="font-display font-light text-stone-900 text-4xl" style={{ letterSpacing: '-0.022em' }}>Post a Job</h1>
          <p className="text-stone-400 text-sm mt-2">Create a new job posting to attract top talent</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <Input
                label="Job Title"
                placeholder="e.g., Software Developer"
                error={errors.title?.message}
                {...register('title')}
                required
              />

              <Textarea
                label="Job Description"
                rows={8}
                placeholder="Describe the role, responsibilities, and what makes your company great..."
                error={errors.description?.message}
                {...register('description')}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Job Type"
                  options={JOB_TYPES}
                  error={errors.type?.message}
                  {...register('type')}
                  required
                />
                <Select
                  label="Sector"
                  options={SECTORS}
                  error={errors.sector?.message}
                  {...register('sector')}
                  required
                />
                <Input
                  label="Location"
                  placeholder="e.g., Kigali"
                  error={errors.location?.message}
                  {...register('location')}
                  required
                />
                <div className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    id="isRemote"
                    {...register('isRemote')}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <label htmlFor="isRemote" className="text-[10px] uppercase tracking-label text-stone-400">
                    Remote work available
                  </label>
                </div>
              </div>
            </div>

            {/* Salary Range */}
            <div>
              <label className="block text-[10px] uppercase tracking-label text-stone-400 mb-2.5">
                Salary Range (RWF)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Minimum"
                  type="number"
                  {...register('salaryMin', { valueAsNumber: true })}
                />
                <Input
                  placeholder="Maximum"
                  type="number"
                  {...register('salaryMax', { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-[10px] uppercase tracking-label text-stone-400 mb-2.5">
                Requirements
              </label>
              <div className="space-y-2">
                {requirements.map((req, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., Bachelor's degree in Computer Science"
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="ghost" size="sm" onClick={addRequirement}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Requirement
                </Button>
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-[10px] uppercase tracking-label text-stone-400 mb-2.5">
                Required Skills
              </label>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., JavaScript, React, Node.js"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeSkill(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="ghost" size="sm" onClick={addSkill}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>
            </div>

            {/* Application Deadline */}
            <Input
              label="Application Deadline (Optional)"
              type="date"
              error={errors.applicationDeadline?.message}
              {...register('applicationDeadline')}
            />

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/employer/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                loading={createJobMutation.isPending}
              >
                Post Job
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;
