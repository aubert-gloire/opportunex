import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Building2,
  CreditCard,
  Check,
  Crown,
} from 'lucide-react';
import { userAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { SUBSCRIPTION_PLANS } from '@/utils/constants';

const employerSidebarLinks = [
  { path: '/employer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/employer/post-job', label: 'Post a Job', icon: <Briefcase className="w-4 h-4" /> },
  { path: '/employer/my-postings', label: 'My Postings', icon: <FileText className="w-4 h-4" /> },
  { path: '/employer/talent-search', label: 'Search Talent', icon: <Users className="w-4 h-4" /> },
  { path: '/employer/subscription', label: 'Subscription', icon: <CreditCard className="w-4 h-4" /> },
  { path: '/employer/profile', label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
];

const Subscription = () => {
  const { data: profileData } = useQuery({
    queryKey: ['employerProfile'],
    queryFn: async () => {
      const response = await userAPI.getProfile();
      return response.data;
    },
  });

  const currentPlan = profileData?.profile?.subscription?.plan || 'free';
  const isActive = profileData?.profile?.subscription?.isActive;
  const endDate = profileData?.profile?.subscription?.endDate;

  return (
    <DashboardLayout sidebarLinks={employerSidebarLinks}>
      <div className="space-y-6">
        <div className="border-b border-stone-100 pb-8 mb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Account</p>
          <h1 className="font-display font-light text-stone-900 text-4xl" style={{ letterSpacing: '-0.022em' }}>Subscription & Billing</h1>
          <p className="text-stone-400 text-sm mt-2">Manage your subscription plan</p>
        </div>

        {/* Current Plan */}
        {currentPlan !== 'free' && isActive && (
          <Card className="border-stone-100">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-light text-stone-900 text-lg" style={{ letterSpacing: '-0.01em' }}>
                  Current Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                </h3>
                <p className="text-sm text-stone-400">
                  Active until {formatDate(endDate)}
                </p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          </Card>
        )}

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = plan.name === currentPlan;
            const isPremium = plan.name === 'premium';

            return (
              <Card
                key={plan.name}
                className={`relative ${isPremium ? 'ring-2 ring-accent' : ''}`}
              >
                {isPremium && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="accent">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="mb-2">{plan.label}</div>
                    <div className="font-display font-light text-primary text-4xl" style={{ letterSpacing: '-0.022em' }}>
                      {plan.price === 0 ? (
                        'Free'
                      ) : (
                        <>
                          {formatCurrency(plan.price)}
                          <span className="text-lg text-stone-400">/month</span>
                        </>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-stone-500">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={isPremium ? 'accent' : isCurrent ? 'secondary' : 'primary'}
                    className="w-full"
                    disabled={isCurrent}
                  >
                    {isCurrent ? 'Current Plan' : plan.name === 'free' ? 'Downgrade' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-stone-400 text-sm py-8">
              No payment history yet
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
