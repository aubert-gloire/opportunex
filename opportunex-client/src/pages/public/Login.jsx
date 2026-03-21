import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Logo from '@/components/ui/Logo';

const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data);
      if (result.success) {
        toast.success('Welcome back');
        const map = { youth: '/youth/dashboard', employer: '/employer/dashboard', admin: '/admin/dashboard' };
        navigate(map[result.user.role] || '/');
      } else {
        toast.error(result.message || 'Sign in failed');
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
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,1) 39px, rgba(255,255,255,1) 40px)',
          }}
        />

        <div className="relative z-10">
          <Logo size="sm" variant="light" markOnly />
        </div>

        <div className="relative z-10">
          <h1
            className="font-display font-light text-white leading-[1.08] tracking-tight mb-8"
            style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}
          >
            Welcome<br />
            <em>Back.</em>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed max-w-[280px] font-light">
            Continue your journey toward meaningful work and lasting impact.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-white/25 text-[10px] uppercase tracking-luxury">
            Rwanda's Premier Career Platform
          </p>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────── */}
      <div className="flex-1 bg-white flex flex-col justify-center px-8 md:px-14 lg:px-20 py-14">

        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <Logo size="sm" variant="dark" />
        </div>

        <div className="max-w-[380px] w-full mx-auto">

          {/* Header */}
          <div className="mb-12">
            <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-3">Sign In</p>
            <h2
              className="font-display text-4xl font-light text-stone-900"
              style={{ letterSpacing: '-0.022em' }}
            >
              <em>Good</em> to<br />see you.
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
              required
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Your password"
                error={errors.password?.message}
                {...register('password')}
                required
              />
              <div className="mt-3 text-right">
                <Link
                  to="/forgot-password"
                  className="text-[10px] uppercase tracking-label text-stone-400 hover:text-stone-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-4"
                loading={loading}
                disabled={loading}
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <p className="text-[11px] text-stone-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary underline-offset-2 hover:underline">
                Create one
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
