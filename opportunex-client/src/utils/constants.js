export const UNIVERSITIES = [
  'University of Rwanda',
  'ALU',
  'AUCA',
  'Other',
];

export const SECTORS = [
  'Technology',
  'Finance',
  'Hospitality',
  'Engineering',
  'Business',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Agriculture',
  'Other',
];

export const JOB_TYPES = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'internship', label: 'Internship' },
  { value: 'contract', label: 'Contract' },
];

export const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '200+', label: '200+ employees' },
];

export const APPLICATION_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'reviewed', label: 'Reviewed', color: 'blue' },
  { value: 'shortlisted', label: 'Shortlisted', color: 'purple' },
  { value: 'interviewed', label: 'Interviewed', color: 'indigo' },
  { value: 'accepted', label: 'Accepted', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
];

export const SUBSCRIPTION_PLANS = [
  {
    name: 'free',
    label: 'Free',
    price: 0,
    features: [
      'View talent database (limited)',
      '1 job posting per month',
      'Basic application management',
    ],
  },
  {
    name: 'basic',
    label: 'Basic',
    price: 20000,
    features: [
      '5 job postings per month',
      'Full talent search',
      'Application management',
      'Email notifications',
    ],
  },
  {
    name: 'premium',
    label: 'Premium',
    price: 50000,
    features: [
      'Unlimited job postings',
      'Priority listing',
      'Advanced analytics',
      'Direct messaging',
      'Dedicated support',
    ],
  },
];

export const SKILL_CATEGORIES = [
  'Technical',
  'Soft Skills',
  'Business',
  'Language',
  'Other',
];

export const MENTORSHIP_TOPICS = [
  'Career Guidance',
  'Interview Preparation',
  'Resume Writing',
  'Technical Skills',
  'Networking',
  'Leadership',
  'Communication',
  'Project Management',
  'Other',
];

export const PAYMENT_METHODS = [
  { value: 'momo', label: 'MTN MoMo', icon: '📱' },
  { value: 'airtel_money', label: 'Airtel Money', icon: '📱' },
  { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { value: 'bank', label: 'Bank Transfer', icon: '🏦' },
];

export const COMMON_SKILLS = [
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'Communication',
  'Leadership',
  'Project Management',
  'Microsoft Office',
  'Customer Service',
  'Sales',
  'Marketing',
  'Accounting',
  'Data Analysis',
  'Problem Solving',
];
