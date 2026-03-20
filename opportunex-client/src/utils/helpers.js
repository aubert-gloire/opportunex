import { format, formatDistance, formatRelative } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const formatDateRelative = (date) => {
  if (!date) return '';
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

export const formatDateToInput = (date) => {
  if (!date) return '';
  return format(new Date(date), 'yyyy-MM-dd');
};

export const formatCurrency = (amount, currency = 'RWF') => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDuration = (minutes) => {
  if (!minutes) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

export const statusColors = {
  // Application statuses
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  shortlisted: 'bg-purple-100 text-purple-800',
  interviewed: 'bg-indigo-100 text-indigo-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',

  // Job statuses
  open: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
  filled: 'bg-blue-100 text-blue-800',

  // Mentorship statuses
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const sectorIcons = {
  Technology: '💻',
  Finance: '💰',
  Hospitality: '🏨',
  Engineering: '⚙️',
  Business: '💼',
  Healthcare: '🏥',
  Education: '📚',
  Manufacturing: '🏭',
  Agriculture: '🌾',
  Other: '📋',
};

export const skillBadges = {
  beginner: { color: 'bg-green-100 text-green-800', label: 'Beginner' },
  intermediate: { color: 'bg-blue-100 text-blue-800', label: 'Intermediate' },
  advanced: { color: 'bg-purple-100 text-purple-800', label: 'Advanced' },
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^(\+2507|07)[2-9]\d{7}$/;
  return re.test(phone);
};
