import { useState, useEffect, useCallback } from 'react';
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

  // CRITICAL: wrap the scroll handler in useCallback with dependency array [page, hasMore, loading]
  // The reason for useCallback: without it, a new function reference is created on every render,
  // causing the event listener to be added and removed on every render — a performance bug.
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      if (!loading && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
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

  return (
    <>
      <div className="flex bg-brand-mint min-h-screen">
        <Sidebar
          title="NAVIGATION"
          links={[
            {
              label: 'Home',
              to: '/home',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11v-5m0 0V9m0 5h.01M9 15h6" />
                </svg>
              )
            },
            {
              label: 'Dashboard',
              to: '/student/dashboard',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )
            },
            {
              label: 'My Profile',
              to: '/student/profile',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )
            },
            {
              label: 'Browse Jobs',
              to: '/jobs',
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )
            },
          ]}
        />
        <div className="flex-1 flex flex-col">
          <div className="bg-brand-mint min-h-[calc(100vh-80px)] py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-brand-navy mb-2">Find the right job</h1>
                <p className="text-gray-600 text-lg">Browse through hundreds of opportunities across different trades and locations.</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full lg:w-64 shrink-0">
                  <Card className="p-5 sticky top-24">
                    <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Trade</label>
                        <select
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white"
                          value={filters.trade}
                          onChange={(e) => setFilters(prev => ({ ...prev, trade: e.target.value }))}
                        >
                          <option value="">All Trades</option>
                          {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">District</label>
                        <select
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white"
                          value={filters.district}
                          onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
                        >
                          <option value="">All Districts</option>
                          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <button
                        className="mt-2 w-full px-4 py-2 text-sm font-medium text-brand-navy border border-brand-navy rounded-lg hover:bg-brand-navy hover:text-white transition-colors"
                        onClick={() => setFilters({ trade: '', district: '' })}
                        disabled={!filters.trade && !filters.district}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </Card>
                </div>

                {/* Job Listings */}
                <div className="flex-1 space-y-4">
                  {filteredJobs.length === 0 && !loading ? (
                    <Card className="p-12 text-center border-dashed">
                      <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                    </Card>
                  ) : (
                    filteredJobs.map((job) => (
                      <Card
                        key={job._id}
                        className="p-6 hover:shadow-card-hover transition-all duration-200 cursor-pointer group"
                        onClick={() => navigate(`/jobs/${job._id}`)}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-brand-blue transition-colors">{job.title}</h2>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="blue">{job.trade}</Badge>
                              <Badge variant="green" className="flex items-center gap-1.5 px-3">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {job.district}
                              </Badge>
                              {job.certificationsRequired?.map(cert => (
                                <Badge key={cert} variant="orange">{cert}</Badge>
                              ))}
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                          </div>
                          <div className="shrink-0 pt-1">
                            <button className="px-6 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black hover:-translate-y-0.5 transition-all shadow-md shadow-slate-200">
                              Apply
                            </button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}

                  {loading && (
                    <div className="py-8 text-center">
                      <p className="text-gray-500 font-medium animate-pulse">Loading...</p>
                    </div>
                  )}

                  {!hasMore && jobs.length > 0 && (
                    <div className="py-8 text-center">
                      <p className="text-gray-400">No more jobs</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default JobList;
