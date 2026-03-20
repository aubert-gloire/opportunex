import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Calendar,
  Clock,
  Video,
  MessageSquare,
  Star,
  Search,
} from 'lucide-react';
import { mentorshipAPI } from '@/api';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import EmptyState from '@/components/ui/EmptyState';
import { formatDate, getInitials } from '@/utils/helpers';
import { SECTORS } from '@/utils/constants';

const youthSidebarLinks = [
  { path: '/youth/dashboard', label: 'Dashboard', icon: <Users className="w-4 h-4" /> },
  { path: '/youth/jobs', label: 'Find Jobs', icon: <Users className="w-4 h-4" /> },
  { path: '/youth/mentorship', label: 'Mentorship', icon: <Users className="w-4 h-4" /> },
];

const Mentorship = () => {
  const [activeTab, setActiveTab] = useState('find');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: mentors, isLoading: loadingMentors } = useQuery({
    queryKey: ['mentors'],
    queryFn: async () => {
      const response = await mentorshipAPI.getMentors();
      return response.data.mentors || [];
    },
    enabled: activeTab === 'find',
  });

  const { data: sessions, isLoading: loadingSessions } = useQuery({
    queryKey: ['my-sessions'],
    queryFn: async () => {
      const response = await mentorshipAPI.getMySessions({ role: 'mentee' });
      return response.data.sessions || [];
    },
    enabled: activeTab === 'my-sessions',
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'secondary', label: 'Pending' },
      confirmed: { variant: 'primary', label: 'Confirmed' },
      completed: { variant: 'success', label: 'Completed' },
      cancelled: { variant: 'danger', label: 'Cancelled' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <DashboardLayout sidebarLinks={youthSidebarLinks}>
      <div className="space-y-6">
        <div className="border-b border-stone-100 pb-8 mb-8">
          <p className="text-[10px] uppercase tracking-luxury text-stone-400 mb-2">Network</p>
          <h1 className="font-display font-light text-stone-900 text-4xl" style={{ letterSpacing: '-0.022em' }}>Mentorship</h1>
          <p className="text-stone-400 text-sm mt-2">Connect with experienced professionals</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-stone-100">
          <button
            onClick={() => setActiveTab('find')}
            className={`px-4 py-2 text-sm font-light transition-colors ${
              activeTab === 'find'
                ? 'text-primary border-b-2 border-primary'
                : 'text-stone-400 hover:text-stone-900'
            }`}
          >
            Find Mentors
          </button>
          <button
            onClick={() => setActiveTab('my-sessions')}
            className={`px-4 py-2 text-sm font-light transition-colors ${
              activeTab === 'my-sessions'
                ? 'text-primary border-b-2 border-primary'
                : 'text-stone-400 hover:text-stone-900'
            }`}
          >
            My Sessions
          </button>
        </div>

        {/* Find Mentors Tab */}
        {activeTab === 'find' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <Input
                  placeholder="Search mentors by name or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </CardContent>
            </Card>

            {loadingMentors ? (
              <div className="text-center py-12">
                <p className="text-stone-400 text-sm">Loading mentors...</p>
              </div>
            ) : mentors && mentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentors.map((mentor) => (
                  <Card key={mentor._id} hover>
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <Avatar
                          src={mentor.avatar}
                          alt={`${mentor.firstName} ${mentor.lastName}`}
                          className="w-20 h-20 mx-auto mb-3"
                        />
                        <h3 className="font-light text-stone-900 text-lg" style={{ letterSpacing: '-0.01em' }}>
                          {mentor.firstName} {mentor.lastName}
                        </h3>
                        <p className="text-sm text-stone-400">{mentor.title}</p>
                      </div>

                      {mentor.bio && (
                        <p className="text-sm text-stone-500 mb-4 line-clamp-3">
                          {mentor.bio}
                        </p>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1 text-sm text-stone-400">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>4.8 (12)</span>
                        </div>
                        <Badge variant="primary">Technology</Badge>
                      </div>

                      <Button variant="primary" className="w-full">
                        Request Session
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Users className="w-16 h-16" />}
                title="No mentors available"
                description="Check back later for mentorship opportunities"
              />
            )}
          </div>
        )}

        {/* My Sessions Tab */}
        {activeTab === 'my-sessions' && (
          <div className="space-y-4">
            {loadingSessions ? (
              <div className="text-center py-12">
                <p className="text-stone-400 text-sm">Loading your sessions...</p>
              </div>
            ) : sessions && sessions.length > 0 ? (
              sessions.map((session) => (
                <Card key={session._id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar
                        src={session.mentor?.avatar}
                        alt={session.mentor?.name}
                        className="w-12 h-12"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-light text-stone-900" style={{ letterSpacing: '-0.01em' }}>
                              {session.topic}
                            </h3>
                            <p className="text-sm text-stone-400">
                              with {session.mentor?.firstName} {session.mentor?.lastName}
                            </p>
                          </div>
                          {getStatusBadge(session.status)}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-stone-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(session.scheduledAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{session.duration} minutes</span>
                          </div>
                        </div>

                        {session.status === 'confirmed' && (
                          <div className="flex gap-2">
                            <Button variant="primary" size="sm">
                              Join Meeting
                            </Button>
                            <Button variant="outline" size="sm">
                              Message
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <EmptyState
                icon={<Calendar className="w-16 h-16" />}
                title="No mentorship sessions"
                description="Request a session with a mentor to get started"
              />
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Mentorship;
