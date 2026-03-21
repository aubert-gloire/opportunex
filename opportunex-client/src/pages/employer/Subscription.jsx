import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  Building2,
  CreditCard,
  Check,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { userAPI, paymentAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate, formatCurrency } from '@/utils/helpers';
import { SUBSCRIPTION_PLANS, PAYMENT_METHODS } from '@/utils/constants';

const FLW_PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;

const employerSidebarLinks = [
  { path: '/employer/dashboard',    label: 'Dashboard',       icon: <LayoutDashboard className="w-4 h-4" /> },
  { path: '/employer/post-job',     label: 'Post a Job',      icon: <Briefcase className="w-4 h-4" /> },
  { path: '/employer/my-postings',  label: 'My Postings',     icon: <FileText className="w-4 h-4" /> },
  { path: '/employer/talent-search',label: 'Search Talent',   icon: <Users className="w-4 h-4" /> },
  { path: '/employer/subscription', label: 'Subscription',    icon: <CreditCard className="w-4 h-4" /> },
  { path: '/employer/profile',      label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
];

// Inner component so we can call useFlutterwave after txRef/amount are known
const PaymentButton = ({ txRef, amount, user, plan, paymentMethod, onSuccess, onClose, loading }) => {
  const config = {
    public_key: FLW_PUBLIC_KEY,
    tx_ref: txRef,
    amount,
    currency: 'RWF',
    payment_options: 'mobilemoneyrwanda,card',
    customer: {
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      phone_number: user.phone || '',
    },
    customizations: {
      title: 'OpportuneX',
      description: `${plan.label} Plan Subscription`,
      logo: 'https://opportunex.com/logo.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <Button
      variant="primary"
      className="w-full"
      disabled={loading}
      onClick={() => {
        handleFlutterPayment({
          callback: (response) => {
            closePaymentModal();
            if (response.status === 'successful' || response.status === 'completed') {
              onSuccess(response.transaction_id, txRef);
            } else {
              toast.error('Payment was not completed');
              onClose();
            }
          },
          onclose: onClose,
        });
      }}
    >
      {loading ? 'Processing...' : `Pay ${formatCurrency(amount)}`}
    </Button>
  );
};

const Subscription = () => {
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [pendingPayment, setPendingPayment] = useState(null); // { txRef, amount }
  const [verifying, setVerifying] = useState(false);

  const { data: profileData } = useQuery({
    queryKey: ['employerProfile'],
    queryFn: async () => (await userAPI.getProfile()).data,
  });

  const { data: paymentsData } = useQuery({
    queryKey: ['myPayments'],
    queryFn: async () => (await paymentAPI.getMyPayments()).data,
  });

  // Step 1: create pending record, get txRef
  const initMutation = useMutation({
    mutationFn: (data) => paymentAPI.subscribe(data),
    onSuccess: (res) => {
      const { txRef, amount, simulated } = res.data;

      if (simulated) {
        // Dev mode — no key configured, already activated
        toast.success(`Subscribed to ${selectedPlan.label} plan!`);
        setSelectedPlan(null);
        queryClient.invalidateQueries({ queryKey: ['employerProfile'] });
        queryClient.invalidateQueries({ queryKey: ['myPayments'] });
        return;
      }

      // Store for PaymentButton
      setPendingPayment({ txRef, amount });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
    },
  });

  // Step 2: verify after Flutterwave callback
  const handlePaymentSuccess = async (transactionId, txRef) => {
    setVerifying(true);
    try {
      await paymentAPI.verifyPayment({ transactionId: String(transactionId), txRef });
      toast.success(`Subscribed to ${selectedPlan.label} plan!`);
      setSelectedPlan(null);
      setPendingPayment(null);
      queryClient.invalidateQueries({ queryKey: ['employerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['myPayments'] });
    } catch {
      toast.error('Payment verification failed. Contact support.');
    } finally {
      setVerifying(false);
    }
  };

  const handleClose = () => {
    setSelectedPlan(null);
    setPendingPayment(null);
  };

  const currentPlan = profileData?.profile?.subscription?.plan || 'free';
  const isActive    = profileData?.profile?.subscription?.isActive;
  const endDate     = profileData?.profile?.subscription?.endDate;
  const payments    = paymentsData?.payments || [];
  const user        = profileData?.user || {};

  return (
    <DashboardLayout sidebarLinks={employerSidebarLinks}>
      <div className="space-y-6">
        <div className="border-b border-stone-100 pb-8 mb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Account</p>
          <h1 className="font-display font-light text-stone-900 text-3xl sm:text-4xl" style={{ letterSpacing: '-0.022em' }}>
            Subscription & Billing
          </h1>
          <p className="text-stone-400 text-sm mt-2">Manage your subscription plan</p>
        </div>

        {/* Current Plan banner */}
        {currentPlan !== 'free' && isActive && (
          <div className="border border-stone-100 p-5 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h3 className="font-light text-stone-900 text-lg" style={{ letterSpacing: '-0.01em' }}>
                {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
              </h3>
              <p className="text-sm text-stone-400 mt-0.5">Active until {formatDate(endDate)}</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        )}

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = plan.name === currentPlan;
            const isPremium = plan.name === 'premium';

            return (
              <Card key={plan.name} className={`relative ${isPremium ? 'ring-2 ring-accent' : ''}`}>
                {isPremium && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="accent">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="mb-2">{plan.label}</div>
                    <div className="font-display font-light text-primary text-4xl" style={{ letterSpacing: '-0.022em' }}>
                      {plan.price === 0 ? 'Free' : (
                        <>{formatCurrency(plan.price)}<span className="text-lg text-stone-400">/mo</span></>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-stone-500">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={isPremium ? 'accent' : isCurrent ? 'secondary' : 'primary'}
                    className="w-full"
                    disabled={isCurrent || plan.name === 'free'}
                    onClick={() => !isCurrent && plan.name !== 'free' && setSelectedPlan(plan)}
                  >
                    {isCurrent ? 'Current Plan' : plan.name === 'free' ? 'Free Plan' : `Upgrade to ${plan.label}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Payment History */}
        <Card padding={false}>
          <CardHeader className="px-6 pt-6 pb-4 border-b border-stone-100">
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-center text-stone-400 text-sm py-8">No payments yet</p>
            ) : (
              <div>
                {payments.map((p) => (
                  <div key={p._id} className="flex items-center justify-between px-6 py-4 border-b border-stone-50 last:border-0">
                    <div>
                      <p className="text-sm text-stone-900 font-light capitalize">{p.type?.replace('_', ' ')} — {p.description}</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">{formatDate(p.createdAt)} · {p.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-stone-900">{formatCurrency(p.amount)}</p>
                      <Badge variant={p.status === 'completed' ? 'success' : p.status === 'pending' ? 'warning' : 'gray'}>
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upgrade modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white w-full max-w-md p-8 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>

            <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Upgrade Plan</p>
            <h2 className="font-display font-light text-stone-900 text-2xl mb-1" style={{ letterSpacing: '-0.022em' }}>
              {selectedPlan.label} Plan
            </h2>
            <p className="text-stone-400 text-sm mb-6">{formatCurrency(selectedPlan.price)} / month</p>

            {/* Payment method selector */}
            <div className="mb-6">
              <label className="block text-[10px] uppercase tracking-label text-stone-400 mb-2.5">
                Payment Method
              </label>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.value}
                    className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                      paymentMethod === m.value ? 'border-primary bg-primary/5' : 'border-stone-100 hover:border-stone-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.value}
                      checked={paymentMethod === m.value}
                      onChange={() => setPaymentMethod(m.value)}
                      className="sr-only"
                    />
                    <span>{m.icon}</span>
                    <span className="text-sm text-stone-700">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 1: Init payment record → Step 2: Open Flutterwave popup */}
            {!pendingPayment ? (
              <Button
                variant="primary"
                className="w-full"
                disabled={initMutation.isPending}
                onClick={() => initMutation.mutate({ plan: selectedPlan.name, paymentMethod })}
              >
                {initMutation.isPending ? 'Preparing...' : `Continue — ${formatCurrency(selectedPlan.price)}`}
              </Button>
            ) : (
              <PaymentButton
                txRef={pendingPayment.txRef}
                amount={pendingPayment.amount}
                user={user}
                plan={selectedPlan}
                paymentMethod={paymentMethod}
                onSuccess={handlePaymentSuccess}
                onClose={handleClose}
                loading={verifying}
              />
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Subscription;
