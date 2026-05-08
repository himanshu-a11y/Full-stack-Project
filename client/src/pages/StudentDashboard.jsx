import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import JobTicker from '../components/JobTicker';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentJobs, setRecentJobs] = useState([]);
  const [tickerJobs, setTickerJobs] = useState([]);
  const [stats, setStats] = useState({ applications: 0, skillMatches: 0, messages: 0, profileViews: 0 });

  const calculateCompletion = (user) => {
    if (!user) return 0;
    const fields = [
      { key: 'phone', weight: 20 },
      { key: 'trade', weight: 20 },
      { key: 'state', weight: 20 },
      { key: 'district', weight: 20 },
      { key: 'certifications', weight: 20, isArray: true },
    ];

    let score = 0;
    fields.forEach(f => {
      const val = user[f.key];
      if (f.isArray) {
        if (val && val.length > 0) score += f.weight;
      } else {
        if (val && val !== '') score += f.weight;
      }
    });
    return score;
  };

  const completion = calculateCompletion(profile);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, jobsRes, appsRes, messagesRes] = await Promise.all([
          axios.get('/api/student/profile'),
          axios.get('/api/jobs/match'),
          axios.get('/api/applications/student'),
          axios.get('/api/messages/unread-count')
        ]);
        setProfile(profileRes.data.student);
        const matches = jobsRes.data.jobs || [];
        setRecentJobs(matches.slice(0, 3));
        
        // If matches are empty, fetch all jobs for the ticker to ensure it's not empty
        if (matches.length === 0) {
          const allJobsRes = await axios.get('/api/jobs');
          setTickerJobs(allJobsRes.data.jobs || []);
        } else {
          setTickerJobs(matches);
        }

        setStats({
          applications: appsRes.data.applications?.length || 0,
          skillMatches: matches.length || 0,
          messages: messagesRes.data.count || 0,
          profileViews: profileRes.data.student?.profileViews || 0
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const sidebarLinks = [
    {
      label: 'Dashboard',
      to: '/student/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'My Profile',
      to: '/student/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: 'Browse Jobs',
      to: '/jobs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Applications',
      to: '/student/applications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      label: 'Messages',
      to: '/messages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-blue rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#F0FDF4] h-screen overflow-hidden font-sans">
      <Sidebar
        links={sidebarLinks}
        title="STUDENT NAVIGATION"
        roleBadge={{ type: 'student', label: 'Student Portal' }}
        user={profile}
      />

      <div className="flex-1 overflow-y-auto h-full p-6 pt-24 lg:p-12 w-full scrollbar-hide">
        <div className="max-w-6xl mx-auto">
          <JobTicker jobs={tickerJobs} />
          
          {/* Welcome Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Welcome, <span className="text-brand-blue">{profile?.name?.split(' ')[0]}!</span>
                {profile?.isVerified ? (
                  <span className="ml-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Verified
                  </span>
                ) : (
                  <span className="ml-3 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                    Verification Pending
                  </span>
                )}
              </h1>
              <p className="text-slate-500 font-medium mt-1">Check out your job matches and application status today.</p>
            </div>
            <div className="flex gap-3">
              {/* Redundant buttons removed */}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 border-0 shadow-soft bg-white group hover:shadow-card transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="text-2xl font-black text-slate-900">{stats.applications}</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Applications</p>
            </Card>

            <Card className="p-6 border-0 shadow-soft bg-white group hover:shadow-card transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                </div>
                <span className="text-2xl font-black text-slate-900">{stats.skillMatches}</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill Matches</p>
            </Card>

            <Card className="p-6 border-0 shadow-soft bg-white group hover:shadow-card transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <span className="text-2xl font-black text-slate-900">{stats.profileViews}</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Views</p>
            </Card>

            <Card className="p-6 border-0 shadow-soft bg-white group hover:shadow-card transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <span className="text-2xl font-black text-slate-900">{stats.messages}</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Messages</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content: Recommended Jobs */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recommended for You</h2>
                <Link to="/jobs" className="text-brand-blue text-[10px] font-black uppercase tracking-[0.2em] hover:underline transition-all">View All Jobs</Link>
              </div>

              <div className="space-y-4">
                {recentJobs.map(job => (
                  <Card key={job._id} className="p-6 border-0 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all bg-white group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-blue transition-colors">{job.title}</h3>
                        <div className="flex items-center gap-3 mt-3">
                          <Badge variant="blue" className="text-[9px] uppercase font-black tracking-widest">{job.trade}</Badge>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.district}
                          </span>
                        </div>
                      </div>
                      <Button
                        className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-xl hover:bg-black hover:-translate-y-0.5 transition-all shadow-xl shadow-slate-200"
                        onClick={() => navigate(`/jobs/${job._id}`)}
                      >
                        Apply
                      </Button>
                    </div>
                  </Card>
                ))}
                {recentJobs.length === 0 && (
                  <div className="p-16 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-100 shadow-inner">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Finding matches for your skills...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar: Profile Completion */}
            <div className="space-y-8">
              <Card className="p-8 border-0 shadow-card bg-slate-900 text-white rounded-[2rem] relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-blue/20 rounded-full blur-3xl"></div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Profile Strength</h3>

                <div className="space-y-8">
                  <div className="relative pt-1">
                    <div className="flex mb-4 items-center justify-between">
                      <div>
                        <span className="text-[10px] font-black inline-block py-1 px-3 uppercase rounded-full text-brand-blue bg-brand-blue/10 border border-brand-blue/20">
                          Advanced
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black inline-block text-brand-blue">
                          {completion}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-white/5 border border-white/10 p-0.5">
                      <div style={{ width: `${completion}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-blue rounded-full transition-all duration-1000"></div>
                    </div>
                  </div>

                  {completion < 100 ? (
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">"Your profile is missing some details. Completing this will boost your visibility to employers."</p>
                  ) : (
                    <p className="text-[11px] text-emerald-400 font-medium leading-relaxed italic">"Your profile is 100% complete! You are now fully visible to all employers."</p>
                  )}

                  <Button fullWidth onClick={() => navigate('/student/profile')} className="bg-brand-blue py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-blue/30 transition-all hover:-translate-y-1">
                    {completion < 100 ? 'Complete Profile' : 'Edit Profile'}
                  </Button>
                </div>
              </Card>

              {/* Quick Actions */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
