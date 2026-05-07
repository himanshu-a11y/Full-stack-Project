import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Sidebar from '../components/ui/Sidebar';
import { TRADES } from '../../../shared/constants.js';
import { getCountries, getStates, getDistricts } from '../api/locations';

const JobList = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ trade: '', country: '', state: '', district: '' });
  const [isSmartMatch, setIsSmartMatch] = useState(true);
  const [role, setRole] = useState(localStorage.getItem('skillbridge_role'));
  const [weights, setWeights] = useState({ tradeW: 40, districtW: 30, certW: 30 });
  const [weightError, setWeightError] = useState('');
  const [cached, setCached] = useState(false);

  // Locations data
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const handleAuthChange = () => {
      setRole(localStorage.getItem('skillbridge_role'));
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const observer = useRef();
  const lastJobElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const loadLocations = async () => {
      const cData = await getCountries();
      setCountries(cData);
    };
    loadLocations();
  }, []);

  useEffect(() => {
    if (filters.country) {
      getStates(filters.country).then(setStates);
    } else {
      setStates([]);
      setDistricts([]);
    }
  }, [filters.country]);

  useEffect(() => {
    if (filters.country && filters.state) {
      getDistricts(filters.country, filters.state).then(setDistricts);
    } else {
      setDistricts([]);
    }
  }, [filters.country, filters.state]);

  const fetchJobs = useCallback(async (pageNum, currentFilters, smartMatch) => {
    setLoading(true);
    try {
      const endpoint = smartMatch ? '/api/jobs/match' : '/api/jobs';
      const params = smartMatch ? { 
        tradeW: weights.tradeW, 
        districtW: weights.districtW, 
        certW: weights.certW 
      } : { 
        page: pageNum, 
        limit: 10,
        ...currentFilters
      };
      
      const res = await axios.get(endpoint, { params });
      const newJobs = res.data.jobs || [];
      if (smartMatch) setCached(res.data.cached || false);
      
      if (smartMatch) {
        setJobs(newJobs);
        setHasMore(false);
      } else {
        setJobs(prev => pageNum === 1 ? newJobs : [...prev, ...newJobs]);
        setHasMore(newJobs.length === 10);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [weights]);

  useEffect(() => {
    setPage(1);
    fetchJobs(1, filters, isSmartMatch);
  }, [filters, isSmartMatch, fetchJobs]);

  useEffect(() => {
    if (page > 1 && !isSmartMatch) {
      fetchJobs(page, filters, false);
    }
  }, [page, isSmartMatch, fetchJobs, filters]);

  const handleWeightChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...weights, [name]: parseInt(value) };
    setWeights(updated);
    const total = updated.tradeW + updated.districtW + updated.certW;
    if (total !== 100) {
      setWeightError(`Weights must add up to 100. Current total: ${total}`);
    } else {
      setWeightError('');
    }
  };

  const handleRematch = () => {
    if (weights.tradeW + weights.districtW + weights.certW !== 100) return;
    fetchJobs(1, filters, true);
  };

  const studentLinks = [
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

  const employerLinks = [
    {
      label: 'Dashboard',
      to: '/employer/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Manage Applications',
      to: '/employer/applications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    {
      label: 'Post New Job',
      to: '/employer/post-job',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      label: 'Company Profile',
      to: '/employer/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex bg-[#F0FDF4] h-screen overflow-hidden font-sans">
      {/* Sidebar - Always rendered for logged-in users */}
      <Sidebar 
        links={role === 'student' ? studentLinks : employerLinks} 
        title={role === 'student' ? 'STUDENT PANEL' : 'EMPLOYER PANEL'} 
        roleBadge={role === 'student' ? { type: 'student', label: 'Student Portal' } : { type: 'employer', label: 'Employer Hub' }} 
      />

      <div className="flex-1 overflow-y-auto h-full p-6 pt-24 lg:p-12 w-full scrollbar-hide">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Find the right job</h1>
              <p className="text-slate-500 font-medium mt-1">Browse through hundreds of opportunities across different trades and locations.</p>
            </div>
            <div className="flex gap-3">
              {isSmartMatch && (
                <div className="hidden md:flex flex-col items-end mr-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engine Status</span>
                  {cached ? (
                    <span className="text-sm font-semibold text-emerald-600">Optimizer Cache</span>
                  ) : (
                    <span className="text-sm font-semibold text-blue-600">Live Database</span>
                  )}
                </div>
              )}
              {role === 'student' && (
                <button 
                  onClick={() => setIsSmartMatch(!isSmartMatch)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isSmartMatch ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/30' : 'bg-white text-slate-600 shadow-soft hover:shadow-card hover:-translate-y-0.5'}`}
                >
                  <span className={isSmartMatch ? 'animate-pulse' : ''}>✨</span>
                  {isSmartMatch ? 'Smart Match Active' : 'Enable Smart Match'}
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-80 shrink-0">
              <Card className="p-8 border-0 shadow-soft sticky top-0 bg-white">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">{isSmartMatch ? 'Smart Match ✨' : 'Search Filters'}</h3>
                </div>

                {!isSmartMatch ? (
                  <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trade Category</label>
                      <select className="w-full px-4 py-3 text-sm rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-brand-blue" value={filters.trade} onChange={(e) => setFilters(prev => ({ ...prev, trade: e.target.value }))}>
                        <option value="">All Trades</option>
                        {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Country</label>
                      <select className="w-full px-4 py-3 text-sm rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-brand-blue" value={filters.country} onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value, state: '', district: '' }))}>
                        <option value="">All Countries</option>
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State</label>
                      <select className="w-full px-4 py-3 text-sm rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-brand-blue" value={filters.state} onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value, district: '' }))} disabled={!filters.country}>
                        <option value="">All States</option>
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">District</label>
                      <select className="w-full px-4 py-3 text-sm rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-brand-blue" value={filters.district} onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))} disabled={!filters.state}>
                        <option value="">All Districts</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <Button variant="outline" fullWidth onClick={() => setFilters({ trade: '', country: '', state: '', district: '' })} disabled={!filters.trade && !filters.country && !filters.state && !filters.district} className="mt-4 border-slate-100 text-slate-400 hover:text-slate-900">
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <p className="text-xs text-blue-600 font-medium leading-relaxed italic">Tune engine parameters to refine your job recommendations.</p>
                    </div>

                    {weightError && <div className="text-[10px] font-bold text-rose-500 uppercase tracking-tight">{weightError}</div>}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trade Match</span>
                        <span className="text-xs font-black text-brand-blue">{weights.tradeW}%</span>
                      </div>
                      <input type="range" name="tradeW" min="0" max="100" step="5" value={weights.tradeW} onChange={handleWeightChange} className="w-full accent-brand-blue" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</span>
                        <span className="text-xs font-black text-brand-blue">{weights.districtW}%</span>
                      </div>
                      <input type="range" name="districtW" min="0" max="100" step="5" value={weights.districtW} onChange={handleWeightChange} className="w-full accent-brand-blue" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certificates</span>
                        <span className="text-xs font-black text-brand-blue">{weights.certW}%</span>
                      </div>
                      <input type="range" name="certW" min="0" max="100" step="5" value={weights.certW} onChange={handleWeightChange} className="w-full accent-brand-blue" />
                    </div>

                    <Button 
                      fullWidth 
                      onClick={handleRematch} 
                      disabled={weights.tradeW + weights.districtW + weights.certW !== 100 || loading}
                      className="mt-4"
                    >
                      Re-calculate
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Job Listings Area */}
            <div className="flex-1 space-y-6">
              {loading && jobs.length === 0 ? (
                <div className="py-24 text-center">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-slate-100 border-t-brand-blue mb-6"></div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Finding Opportunities...</p>
                </div>
              ) : jobs.length === 0 ? (
                <Card className="p-16 text-center border-2 border-dashed border-slate-100 bg-white">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No results found</h3>
                  <p className="text-slate-500 mb-8 max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                  <Button variant="outline" onClick={() => setFilters({ trade: '', country: '', state: '', district: '' })}>Clear all filters</Button>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {jobs.map((job, index) => {
                      const isLast = jobs.length === index + 1;
                      return (
                        <Card 
                          ref={isLast ? lastJobElementRef : null} 
                          key={job._id} 
                          className="p-8 border-0 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 bg-white group relative overflow-hidden"
                        >
                          {job.score !== undefined && (
                             <div className="absolute top-0 right-0 p-1">
                               <div className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl shadow-lg shadow-emerald-500/20">
                                 {Math.round(job.score)}% Match
                               </div>
                             </div>
                          )}
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="flex-1">
                              <h2 className="text-2xl font-black text-slate-900 group-hover:text-brand-blue transition-colors mb-1 tracking-tight">{job.title}</h2>
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-sm font-bold text-slate-600">{job.employerId?.companyName || 'Private Employer'}</span>
                                {job.employerId?.isVerified ? (
                                  <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    Verified
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                    Pending
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">{job.description}</p>
                              
                              <div className="flex flex-wrap gap-3">
                                <Badge variant="blue" className="bg-blue-50 text-brand-blue border-0 px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">
                                  {job.trade}
                                </Badge>
                                <Badge variant="green" className="bg-emerald-50 text-emerald-600 border-0 px-4 py-1.5 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                  {(job.district || job.state)}, {job.country}
                                </Badge>
                                {job.certRequired?.slice(0, 2).map(cert => (
                                  <Badge key={cert} variant="orange" className="bg-amber-50 text-amber-600 border-0 px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">{cert}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="shrink-0 flex items-center md:self-center">
                              <Button 
                                onClick={async () => {
                                  if (role !== 'student') return alert("Only students can apply.");
                                  try {
                                    await axios.post(`/api/jobs/${job._id}/apply`);
                                    navigate('/application-success');
                                  } catch (err) {
                                    alert(err.response?.data?.message || 'Failed to apply');
                                  }
                                }}
                                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 group-hover:bg-brand-blue group-hover:shadow-brand-blue/30 transition-all"
                              >
                                Apply Now
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                  {loading && jobs.length > 0 && (
                    <div className="py-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-brand-blue"></div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
