import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, jobsRes] = await Promise.all([
          axios.get('/api/student/profile'),
          axios.get('/api/jobs?limit=3')
        ]);
        setProfile(profileRes.data.student);
        setRecentJobs(jobsRes.data.jobs || []);
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
      label: 'Home',
      to: '/home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11v-5m0 0V9m0 5h.01M9 15h6" />
        </svg>
      ),
    },
    {
      label: 'Dashboard',
      to: '/student/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
    }
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
    <div className="flex bg-brand-mint min-h-[calc(100vh-80px)] font-sans">
      <div className="hidden lg:block">
        <Sidebar links={sidebarLinks} title="NAVIGATION" />
      </div>

      <div className="flex-1 p-6 lg:p-12 max-w-6xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Welcome back, <span className="text-brand-blue">{profile?.name?.split(' ')[0]}!</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Here is what is happening with your career progress today.</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 border-0 shadow-soft bg-white group hover:shadow-card transition-all">
             <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span className="text-2xl font-bold text-slate-900">12</span>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applications</p>
          </Card>

          <Card className="p-6 border-0 shadow-soft bg-white group hover:shadow-card transition-all">
             <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
                </div>
                <span className="text-2xl font-bold text-slate-900">08</span>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skill Matches</p>
          </Card>

          <Card className="p-6 border-0 shadow-soft bg-white group hover:shadow-card transition-all">
             <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </div>
                <span className="text-2xl font-bold text-slate-900">24</span>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Views</p>
          </Card>

          <Card className="p-6 border-0 shadow-soft bg-white group hover:shadow-card transition-all">
             <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <span className="text-2xl font-bold text-slate-900">02</span>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Messages</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content: Recommended Jobs */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
               <Link to="/jobs" className="text-brand-blue text-xs font-bold uppercase tracking-widest hover:underline">View All</Link>
            </div>

            <div className="space-y-4">
              {recentJobs.map(job => (
                <Card key={job._id} className="p-6 border-0 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all bg-white group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 group-hover:text-brand-blue transition-colors">{job.title}</h3>
                      <div className="flex items-center gap-3 mt-2">
                         <Badge className="bg-slate-100 text-slate-600 border-0 text-[9px] uppercase font-bold tracking-widest">{job.trade}</Badge>
                         <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                         </svg>
                           {job.district}
                         </span>
                      </div>
                    </div>
                    <Button 
                      className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-8 py-2.5 rounded-xl hover:bg-black hover:-translate-y-0.5 transition-all shadow-md shadow-slate-200"
                      onClick={() => navigate(`/jobs/${job._id}`)}
                    >
                      Apply
                    </Button>
                  </div>
                </Card>
              ))}
              {recentJobs.length === 0 && (
                <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                   <p className="text-slate-400 font-medium">Searching for jobs matching your skills...</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Profile Completion & Actions */}
          <div className="space-y-8">
            <Card className="p-8 border-0 shadow-card bg-slate-900 text-white rounded-2xl relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-blue/20 rounded-full blur-3xl"></div>
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Profile Strength</h3>
               
               <div className="space-y-6">
                 <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                       <div>
                          <span className="text-[10px] font-bold inline-block py-1 px-2 uppercase rounded-full text-brand-blue bg-brand-blue/10">
                             Advanced
                          </span>
                       </div>
                       <div className="text-right">
                          <span className="text-xs font-bold inline-block text-brand-blue">
                             85%
                          </span>
                       </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-white/10">
                       <div style={{ width: "85%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-blue transition-all duration-1000"></div>
                    </div>
                 </div>
                 
                 <p className="text-xs text-slate-400 leading-relaxed">Your profile is missing detailed trade certifications. Adding them increases match accuracy by 40%.</p>
                 
                 <Button fullWidth onClick={() => navigate('/student/profile')} className="bg-brand-blue py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20">
                    Complete Profile
                 </Button>
               </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
