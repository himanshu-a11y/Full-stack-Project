import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Sidebar from '../components/ui/Sidebar';
import Footer from '../components/Footer';

const TRADES = ['Electrician', 'Fitter', 'Welder', 'Turner', 'Mechanic', 'Plumber', 'Carpenter', 'Painter', 'Draughtsman', 'COPA'];
const DISTRICTS = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Mehsana', 'Anand', 'Bhavnagar', 'Jamnagar', 'Junagadh'];

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    trade: '',
    district: '',
  });

  const navigate = useNavigate();
  const role = localStorage.getItem('skillbridge_role');

  const fetchJobs = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/jobs?page=${pageNum}&limit=10`);
      const newJobs = res.data.jobs || [];
      setJobs(prevJobs => pageNum === 1 ? newJobs : [...prevJobs, ...newJobs]);
      setHasMore(newJobs.length === 10);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      if (!loading && hasMore) setPage(prevPage => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    fetchJobs(page);
  }, [page, fetchJobs]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const filteredJobs = jobs.filter(job => {
    if (filters.trade && job.trade !== filters.trade) return false;
    if (filters.district && job.district !== filters.district) return false;
    return true;
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('skillbridge_token');
      if (!token) return;
      try {
        const endpoint = role === 'employer' ? '/api/employer/profile' : '/api/student/profile';
        const res = await axios.get(endpoint);
        setUser(role === 'employer' ? res.data.employer : res.data.student);
      } catch (err) {
        console.error("Failed to fetch user for sidebar", err);
      }
    };
    fetchUser();
  }, [role]);

  const handleApply = async (e, jobId) => {
    e.stopPropagation();
    if (role !== 'student') return;
    try {
      await axios.post(`/api/jobs/${jobId}/apply`);
      navigate('/application-success');
    } catch (err) {
      navigate('/application-success');
    }
  };

  const sidebarLinks = useMemo(() => {
    if (role === 'employer') {
      return [
        { label: 'Post New Job', to: '/employer/post-job', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> },
        { label: 'Dashboard', to: '/employer/dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
        { label: 'Browse Jobs', to: '/jobs', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> }
      ];
    }
    if (role === 'admin') {
      return [
        { label: 'Admin Dashboard', to: '/admin/dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
        { label: 'Import Data', to: '/admin/import', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> }
      ];
    }
    return [
      { label: 'Dashboard', to: '/student/dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
      { label: 'My Profile', to: '/student/profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
      { label: 'Browse Jobs', to: '/jobs', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> }
    ];
  }, [role]);

  return (
    <div className={`flex h-screen overflow-hidden ${role !== 'employer' ? 'bg-[#F0FDF4]' : 'bg-[#F8FAFC]'}`}>
      <div className="hidden md:block h-full shrink-0">
        <Sidebar title="NAVIGATION" links={sidebarLinks} roleBadge={{ type: role || 'student', label: role === 'employer' ? 'Employer Portal' : role === 'admin' ? 'Admin Panel' : 'Student Portal' }} user={user} />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-y-auto scrollbar-hide">
        <div className="py-10 px-4 md:px-10">
          <header className="mb-12">
            <div className="flex items-center gap-2 mb-2">
              <span className={`h-1.5 w-1.5 rounded-full ${role === 'employer' ? 'bg-indigo-500' : 'bg-brand-blue'}`}></span>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${role === 'employer' ? 'text-indigo-500' : 'text-brand-blue'}`}>
                {role === 'employer' ? 'Industry Insights' : 'Live Job Board'}
              </span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              {role === 'employer' ? 'Market Overview' : 'Find the right opportunity'}
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              {role === 'employer' ? 'Track all active postings across the SkillBridge ecosystem.' : 'Browse curated jobs across trades and districts.'}
            </p>
          </header>

          <div className="flex flex-col lg:flex-row gap-10">
            <main className="flex-1 space-y-8 order-2 lg:order-1">
              {filteredJobs.length === 0 && !loading ? (
                <div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No matching opportunities found.</p>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <div key={job._id} className={`group relative bg-white rounded-3xl p-8 border border-slate-100 transition-all duration-500 overflow-hidden ${role === 'student' ? 'hover:border-brand-blue/30 hover:shadow-2xl hover:shadow-brand-blue/10 cursor-pointer' : 'hover:border-indigo-500/20 hover:shadow-xl hover:shadow-slate-200/50'}`} onClick={() => role === 'student' && navigate(`/jobs/${job._id}`)}>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
                      <div className="flex-1 relative z-10">
                        <h2 className={`text-3xl font-black text-slate-900 mb-4 transition-colors tracking-tighter leading-none ${role === 'student' ? 'group-hover:text-brand-blue' : 'group-hover:text-indigo-600'}`}>{job.title}</h2>
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                          <Badge variant="blue" className="font-bold">
                            <span className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                              {job.trade}
                            </span>
                          </Badge>
                          <Badge variant="green" className="font-bold">
                            <span className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              {job.district}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-slate-500 font-medium line-clamp-2 text-lg leading-relaxed">{job.description}</p>
                      </div>
                      {role === 'student' && (
                        <div className="shrink-0 relative z-10 flex flex-col items-center gap-2">
                          {user?.trade !== job.trade && (
                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest animate-pulse flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                              Trade Mismatch
                            </span>
                          )}
                          <button 
                            onClick={(e) => handleApply(e, job._id)}
                            className={`h-14 px-10 text-[11px] font-black uppercase tracking-[0.25em] rounded-[2rem] transition-all shadow-xl hover:-translate-y-1 flex items-center gap-3 ${
                              user?.trade === job.trade 
                                ? 'bg-slate-900 text-white hover:bg-brand-blue shadow-slate-900/10' 
                                : 'bg-white border-2 border-amber-100 text-slate-900 hover:border-amber-400 shadow-amber-900/5'
                            }`}
                          >
                            Apply Now
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {loading && (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-brand-blue animate-spin"></div>
                  <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Fetching Opportunities...</p>
                </div>
              )}
            </main>

            <aside className="w-full lg:w-72 shrink-0 order-1 lg:order-2">
              <Card className="p-8 border-0 shadow-xl shadow-slate-200/50 rounded-3xl sticky top-10">
                <h3 className="font-black text-slate-900 mb-8 flex items-center gap-2 text-sm uppercase tracking-widest">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                  Filter Options
                </h3>
                <div className="space-y-8">
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trade Category</label>
                    <select className="w-full px-5 py-4 text-sm font-bold rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-brand-blue/20 outline-none transition-all appearance-none" value={filters.trade} onChange={(e) => setFilters(prev => ({ ...prev, trade: e.target.value }))}>
                      <option value="">All Available Trades</option>
                      {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preferred District</label>
                    <select className="w-full px-5 py-4 text-sm font-bold rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-brand-blue/20 outline-none transition-all appearance-none" value={filters.district} onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}>
                      <option value="">All Locations</option>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
