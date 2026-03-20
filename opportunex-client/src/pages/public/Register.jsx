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
import { UNIVERSITIES } from '@/utils/constants';

const registerSchema = z.object({
  firstName:       z.string().min(2, 'Required'),
  lastName:        z.string().min(2, 'Required'),
  email:           z.string().email('Invalid email'),
  password:        z.string().min(6, 'Min. 6 characters'),
  confirmPassword: z.string(),
  role:            z.enum(['youth', 'employer']),
  university:      z.string().optional(),
  major:           z.string().optional(),
  companyName:     z.string().optional(),
  industry:        z.string().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'employer' ? 'employer' : 'youth';
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: initialRole },
  });

  const role = watch('role');

  const switchRole = (r) => setValue('role', r, { shouldValidate: false });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await registerUser(data);
      if (result.success) {
        toast.success('Welcome to OpportuneX');
        const map = { youth: '/youth/dashboard', employer: '/employer/dashboard' };
        navigate(map[result.user.role] || '/');
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)]">

      {/* ── Left editorial panel ───────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] bg-primary flex-col justify-between p-16 relative overflow-hidden select-none">
        {/* Subtle texture lines */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,1) 39px, rgba(255,255,255,1) 40px)',
          }}
        />

        <div className="relative z-10">
          <span className="text-[10px] uppercase tracking-luxury text-white/40 font-medium">
            Est. Kigali, 2024
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="font-display font-light text-white leading-[1.08] tracking-tight mb-8"
            style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>
            Your Career,<br />
            <em>Elevated.</em>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-[300px] font-light">
            Connecting Rwanda's emerging talent with forward-thinking organisations.
            Your future begins here.
          </p>
        </div>

        <div className="relative z-10 flex gap-12">
          <div>
            <div className="font-display text-white text-3xl font-light">2,400<span className="text-white/40">+</span></div>
            <div className="text-[10px] uppercase tracking-luxury text-white/30 mt-1">Opportunities</div>
          </div>
          <div>
            <div className="font-display text-white text-3xl font-light">850<span className="text-white/40">+</span></div>
            <div className="text-[10px] uppercase tracking-luxury text-white/30 mt-1">Companies</div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────── */}
      <div className="flex-1 bg-white flex flex-col justify-center overflow-y-auto px-8 md:px-14 lg:px-20 py-14">

        {/* Mobile wordmark */}
        <div className="lg:hidden mb-10">
          <span className="font-display text-xl italic text-primary">OpportuneX</span>
        </div>

        <div className="max-w-[440px] w-full mx-auto">

          {/* Header */}
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-3">Create Account</p>
            <h2 className="font-display text-4xl font-light text-stone-900" style={{ letterSpacing: '-0.022em' }}>
              Join <em>OpportuneX</em>
            </h2>
          </div>

          {/* Role selector */}
          <div className="flex border-b border-stone-200 mb-10">
            {[
              { value: 'youth',    label: 'Student / Youth' },
              { value: 'employer', label: 'Employer'        },
            ].map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => switchRole(value)}
                className="relative pb-3 mr-8 transition-colors duration-150"
              >
                <span className={`text-[10px] uppercase tracking-label font-medium transition-colors duration-150 ${
                  role === value ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
                }`}>
                  {label}
                </span>
                {role === value && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-primary" />
                )}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            <input type="hidden" {...register('role')} />

            <div className="grid grid-cols-2 gap-6">
              <Input
                label="First Name"
                placeholder="Jean"
                error={errors.firstName?.message}
                {...register('firstName')}
                required
              />
              <Input
                label="Last Name"
                placeholder="Mugisha"
                error={errors.lastName?.message}
                {...register('lastName')}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
              required
            />

            <div className="grid grid-cols-2 gap-6">
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
                placeholder="Re-enter"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
                required
              />
            </div>

            {/* Role-specific fields */}
            {role === 'youth' && (
              <div className="grid grid-cols-2 gap-6 pt-2 border-t border-stone-100">
                <Select
                  label="University"
                  options={UNIVERSITIES}
                  placeholder="Select"
                  error={errors.university?.message}
                  {...register('university')}
                />
                <Input
                  label="Field of Study"
                  placeholder="e.g. Computer Science"
                  error={errors.major?.message}
                  {...register('major')}
                />
              </div>
            )}

            {role === 'employer' && (
              <div className="grid grid-cols-2 gap-6 pt-2 border-t border-stone-100">
                <Input
                  label="Company Name"
                  placeholder="Your company"
                  error={errors.companyName?.message}
                  {...register('companyName')}
                  required
                />
                <Input
                  label="Industry"
                  placeholder="e.g. Technology"
                  error={errors.industry?.message}
                  {...register('industry')}
                />
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-4"
                loading={loading}
                disabled={loading}
              >
                Create Account
              </Button>
            </div>
          </form>

          {/* Footer links */}
          <div className="mt-8 space-y-3">
            <p className="text-[11px] text-stone-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary underline-offset-2 hover:underline">
                Sign in
              </Link>
            </p>
            <p className="text-[10px] text-stone-300">
              By creating an account you agree to our{' '}
              <Link to="/terms" className="underline-offset-2 hover:underline">Terms</Link>
              {' '}and{' '}
              <Link to="/privacy" className="underline-offset-2 hover:underline">Privacy Policy</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
