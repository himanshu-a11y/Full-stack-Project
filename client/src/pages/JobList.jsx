import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const TRADES = ['Electrician', 'Fitter', 'Welder', 'Turner', 'Mechanic', 'Plumber', 'Carpenter', 'Painter', 'Draughtsman', 'COPA'];
const DISTRICTS = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Mehsana', 'Anand', 'Bhavnagar', 'Jamnagar', 'Junagadh'];

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef();
  
  const [filters, setFilters] = useState({
    trade: '',
    district: '',
  });

  const lastJobElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    // Reset page and jobs when filters change (if handled by API in future). 
    // Right now, it's just client-side, but it's good practice.
  }, [filters]);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/jobs?page=${page}&limit=10`);
        setJobs(prevJobs => {
          if (page === 1) return res.data.jobs || [];
          return [...prevJobs, ...(res.data.jobs || [])];
        });
        setHasMore(res.data.jobs && res.data.jobs.length > 0);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [page]);

  const filteredJobs = jobs.filter(job => {
    if (filters.trade && job.trade !== filters.trade) return false;
    if (filters.district && job.district !== filters.district) return false;
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-10">
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
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => setFilters({ trade: '', district: '' })}
                  disabled={!filters.trade && !filters.district}
                  className="mt-2"
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-navy mb-4"></div>
                <p className="text-gray-500 font-medium">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card className="p-12 text-center border-dashed">
                <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setFilters({ trade: '', district: '' })}
                >
                  View all jobs
                </Button>
              </Card>
            ) : (
              filteredJobs.map((job, index) => {
                const isLast = filteredJobs.length === index + 1;
                return (
                <Card 
                  ref={isLast ? lastJobElementRef : null} 
                  key={job._id} 
                  className="p-6 hover:shadow-card-hover transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h2>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="blue"><span className="font-semibold text-gray-500 mr-1">Trade:</span> {job.trade}</Badge>
                        <Badge variant="green"><span className="font-semibold text-gray-500 mr-1">Loc:</span> {job.district}</Badge>
                        {job.certRequired?.map(cert => (
                          <Badge key={cert} variant="orange">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-end md:items-center">
                      <Button onClick={() => alert("Application feature goes here!")}>Apply Now</Button>
                    </div>
                  </div>
                </Card>
              )})
            )}
            {loading && jobs.length > 0 && (
              <div className="py-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-navy"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
