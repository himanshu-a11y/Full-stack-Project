import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/api/jobs?page=1&limit=10');
        const allJobs = res.data.jobs || [];
        setJobs(allJobs);
        setStats({
          totalJobs: res.data.total || allJobs.length,
          totalApplications: allJobs.length * 5, // Mock data for now
        });
      } catch (err) {
        console.error('Could not load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const sidebarLinks = [
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
      label: 'Dashboard',
      to: '/employer/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
  ];

  const StatCard = ({ title, value, icon, colorClass }) => (
    <Card className="p-6 flex items-center gap-5 hover:shadow-md transition-all">
      <div className={`p-4 rounded-2xl ${colorClass} text-white shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 leading-none">{value}</h3>
      </div>
    </Card>
  );

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="hidden md:block">
        <Sidebar links={sidebarLinks} title="NAVIGATION" />
      </div>

      <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Employer Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back! Here is what's happening with your job listings.</p>
          </div>
          <Button onClick={() => navigate('/employer/post-job')} className="shadow-lg shadow-brand-blue/20">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Post a New Job
            </span>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Jobs Posted"
            value={stats.totalJobs}
            colorClass="bg-blue-500"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
          <StatCard
            title="Active Matches"
            value={stats.totalApplications}
            colorClass="bg-emerald-500"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />
          <StatCard
            title="Days Active"
            value="12"
            colorClass="bg-violet-500"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
        </div>

        <Card className="p-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">Recent Job Postings</h3>
            <Link to="/employer/post-job" className="text-sm font-bold text-brand-blue hover:underline">View All</Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 font-medium">Loading your activity...</div>
          ) : jobs.length === 0 ? (
            <div className="py-16 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 font-medium mb-4">No jobs posted yet.</p>
              <Button variant="outline" onClick={() => navigate('/employer/post-job')}>Post Your First Job</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                    <th className="px-4 py-4">Position</th>
                    <th className="px-4 py-4">Trade</th>
                    <th className="px-4 py-4">Location</th>
                    <th className="px-4 py-4 text-right">Candidates</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700">
                  {jobs.map((job) => (
                    <tr key={job._id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-5">
                        <Link to={`/employer/jobs/${job._id}/candidates`} className="font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                          {job.title}
                        </Link>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Posted {new Date(job.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-5 font-medium">{job.trade}</td>
                      <td className="px-4 py-5 text-slate-500">{job.district}</td>
                      <td className="px-4 py-5 text-right">
                        <Link
                          to={`/employer/jobs/${job._id}/candidates`}
                          className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full font-bold text-xs group-hover:bg-brand-blue group-hover:text-white transition-all"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EmployerDashboard;
