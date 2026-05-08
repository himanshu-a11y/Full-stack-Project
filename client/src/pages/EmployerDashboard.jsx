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
    unreadMessages: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsRes, appsRes, messagesRes] = await Promise.all([
          axios.get('/api/jobs/my-jobs'),
          axios.get('/api/applications/employer'),
          axios.get('/api/messages/unread-count')
        ]);
        const allJobs = jobsRes.data.jobs || [];
        setJobs(allJobs);
        setStats({
          totalJobs: allJobs.length,
          totalApplications: appsRes.data.applications?.length || 0,
          unreadMessages: messagesRes.data.count || 0,
        });
      } catch (err) {
        console.error('Could not load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job? This will also delete all applications for it.")) return;
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
      setStats(prev => ({ ...prev, totalJobs: prev.totalJobs - 1 }));
    } catch (err) {
      alert("Failed to delete job.");
    }
  };

  const sidebarLinks = [
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
    <div className="flex bg-[#F0FDF4] h-screen overflow-hidden font-sans">
      <Sidebar
        links={sidebarLinks}
        title="EMPLOYER NAVIGATION"
        roleBadge={{ type: 'employer', label: 'Employer Portal' }}
      />

      <div className="flex-1 overflow-y-auto h-screen p-6 pt-24 lg:p-12 max-w-7xl mx-auto w-full scrollbar-hide">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Employer Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back! Here is what's happening with your job listings.</p>
          </div>
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
            title="Unread Messages"
            value={stats.unreadMessages}
            colorClass="bg-rose-500"
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
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
                      <td className="px-4 py-5 text-right flex justify-end gap-2">
                        <Link
                          to={`/employer/jobs/${job._id}/candidates`}
                          className="bg-blue-50 text-brand-blue px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-brand-blue hover:text-white transition-all"
                        >
                          Candidates
                        </Link>
                        <button
                          onClick={() => navigate(`/employer/edit-job/${job._id}`)}
                          className="bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-slate-200 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="bg-rose-50 text-rose-600 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-rose-600 hover:text-white transition-all"
                        >
                          Delete
                        </button>
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
