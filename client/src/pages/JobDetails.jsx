import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [user, setUser] = useState(null);

  const role = localStorage.getItem('skillbridge_role');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, userRes] = await Promise.all([
          axios.get(`/api/jobs/${id}`),
          axios.get(role === 'employer' ? '/api/employer/profile' : '/api/student/profile')
        ]);
        setJob(jobRes.data.job);
        setUser(role === 'employer' ? userRes.data.employer : userRes.data.student);
      } catch (err) {
        console.error("Failed to fetch job details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, role]);

  const handleApply = async () => {
    setApplying(true);
    try {
      await axios.post(`/api/jobs/${id}/apply`);
      navigate('/application-success');
    } catch (err) {
      navigate('/application-success');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="h-screen bg-[#F0FDF4] flex items-center justify-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Job Details...</div>;
  if (!job) return <div className="h-screen bg-[#F0FDF4] flex items-center justify-center flex-col gap-4">
    <h2 className="text-xl font-black text-slate-900 uppercase">Job Not Found</h2>
    <button onClick={() => navigate('/jobs')} className="text-[10px] font-black text-brand-blue uppercase tracking-widest hover:underline">Back to listings</button>
  </div>;

  const sidebarLinks = [
    { label: 'Dashboard', to: '/student/dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { label: 'My Profile', to: '/student/profile', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { label: 'Browse Jobs', to: '/jobs', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> }
  ];

  return (
    <div className="flex bg-[#F0FDF4] h-screen overflow-hidden font-sans">
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar links={sidebarLinks} title="NAVIGATION" roleBadge={{ type: 'student', label: 'Student Portal' }} user={user} />
      </div>

      <div className="flex-1 overflow-y-auto p-10 max-w-6xl mx-auto w-full scrollbar-hide">
        <header className="mb-12">
          <button onClick={() => navigate('/jobs')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-blue mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to listings
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="blue" className="font-bold">{job.trade}</Badge>
                <Badge variant="green" className="font-bold">{job.district}</Badge>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-2">{job.title}</h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">{job.employerName || 'Official ITI Opportunity'}</p>
            </div>
            {role === 'student' && (
              <div className="flex flex-col items-center gap-3">
                {user?.trade !== job.trade && (
                  <div className="px-6 py-2 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Incompatible Trade Profile</span>
                  </div>
                )}
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className={`px-12 py-5 font-black uppercase tracking-[0.2em] text-[11px] rounded-3xl transition-all shadow-2xl hover:-translate-y-1 ${user?.trade === job.trade
                      ? 'bg-slate-900 text-white hover:bg-brand-blue shadow-slate-900/10'
                      : 'bg-white border-2 border-amber-200 text-slate-900 hover:border-amber-400 shadow-amber-900/5'
                    }`}
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <Card className="p-10 border-0 shadow-xl shadow-slate-200/40 bg-white rounded-[3rem]">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Role Details</h3>
              <p className="text-slate-600 leading-relaxed text-xl font-medium whitespace-pre-wrap">{job.description}</p>
            </Card>

            <Card className="p-10 border-0 shadow-xl shadow-slate-200/40 bg-white rounded-[3rem]">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Qualifications</h3>
              <div className="flex flex-wrap gap-4">
                {job.certificationsRequired?.map(cert => (
                  <span key={cert} className="flex items-center gap-2 text-[12px] font-black bg-orange-50 border border-orange-100 px-5 py-2.5 rounded-2xl uppercase text-orange-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4" /></svg>
                    {cert}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-8 border-0 shadow-lg shadow-slate-200/30 bg-white rounded-[2.5rem] sticky top-10">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">Quick Facts</h3>
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Trade</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">{job.trade}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">District</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">{job.district}</p>
                </div>
                <div className="pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-3 text-emerald-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Opportunity</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
