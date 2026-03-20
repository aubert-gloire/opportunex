import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import { UserPlus, Briefcase, GraduationCap } from 'lucide-react';
import { UNIVERSITIES } from '@/utils/constants';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['youth', 'employer']),
  // Youth fields
  university: z.string().optional(),
  major: z.string().optional(),
  // Employer fields
  companyName: z.string().optional(),
  industry: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || '';
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: initialRole || 'youth',
    },
  });

  const role = watch('role');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await registerUser(data);
      if (result.success) {
        toast.success('Registration successful! Welcome to OpportuneX');

        // Redirect based on role
        const dashboardMap = {
          youth: '/youth/dashboard',
          employer: '/employer/dashboard',
        };
        navigate(dashboardMap[result.user.role] || '/');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join OpportuneX</h2>
          <p className="text-gray-600">Create your account and start your journey</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedRole('youth')}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${role === 'youth'
                    ? 'bg-white shadow-sm text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <input type="radio" value="youth" {...register('role')} className="hidden" />
                <div className="flex items-center justify-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>I'm a Student</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('employer')}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${role === 'employer'
                    ? 'bg-white shadow-sm text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <input type="radio" value="employer" {...register('role')} className="hidden" />
                <div className="flex items-center justify-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <span>I'm an Employer</span>
                </div>
              </button>
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                error={errors.firstName?.message}
                {...register('firstName')}
                required
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register('lastName')}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
              error={errors.email?.message}
              {...register('email')}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                placeholder="Min. 6 characters"
                error={errors.password?.message}
                {...register('password')}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
                required
              />
            </div>

            {/* Role-Specific Fields */}
            {role === 'youth' && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <Select
                  label="University"
                  options={UNIVERSITIES}
                  placeholder="Select university"
                  error={errors.university?.message}
                  {...register('university')}
                />
                <Input
                  label="Major/Field of Study"
                  placeholder="e.g., Computer Science"
                  error={errors.major?.message}
                  {...register('major')}
                />
              </div>
            )}

            {role === 'employer' && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
                <Input
                  label="Company Name"
                  placeholder="Your company name"
                  error={errors.companyName?.message}
                  {...register('companyName')}
                  required
                />
                <Input
                  label="Industry"
                  placeholder="e.g., Technology"
                  error={errors.industry?.message}
                  {...register('industry')}
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:text-primary-600 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          By signing up, you agree to our{' '}
          <Link to="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
