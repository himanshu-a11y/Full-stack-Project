import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { TRADES, DISTRICTS, CERTIFICATIONS } from '../shared/constants';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import Badge from '../components/ui/Badge';

const PostJob = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    trade: '',
    district: '',
    certRequired: [],
    description: '',
  });

  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/employer/profile');
        setProfile(res.data.employer);
      } catch (err) {
        console.error('Could not load profile:', err);
      }
    };
    fetchProfile();

    const fetchMyJobs = async () => {
      try {
        const res = await axios.get('/api/jobs?page=1&limit=50');
        setMyJobs(res.data.jobs || []);
      } catch (err) {
        console.error('Could not load jobs:', err);
      }
    };
    fetchMyJobs();
  }, [success]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCertChange = (cert) => {
    const current = formData.certRequired;
    if (current.includes(cert)) {
      setFormData({ ...formData, certRequired: current.filter((c) => c !== cert) });
    } else {
      setFormData({ ...formData, certRequired: [...current, cert] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/jobs', formData);
      setSuccess('Job posted successfully!');
      setFormData({ title: '', trade: '', district: '', certRequired: [], description: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="flex bg-[#F0FDF4] h-screen overflow-hidden font-sans">
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar
          links={sidebarLinks}
          title="EMPLOYER NAVIGATION"
          roleBadge={{ type: 'employer', label: 'Employer Hub' }}
          user={profile}
        />
      </div>

      <div className="flex-1 overflow-y-auto h-screen p-6 lg:p-12 max-w-7xl mx-auto w-full scrollbar-hide">
        {/* Professional Light Header */}
        <div className="relative mb-8 overflow-hidden rounded-3xl bg-white p-6 md:p-8 text-slate-900 shadow-xl shadow-slate-200/50 border border-slate-100">
          {/* Subtle Decorative Background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-brand-blue/5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-48 w-48 rounded-full bg-emerald-500/5 blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue shadow-sm shadow-brand-blue/40"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-blue">Recruitment Management</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight md:text-3xl text-slate-900">
                Post <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-navy">New Opportunity</span>
              </h1>
              <p className="max-w-lg text-sm font-medium text-slate-500">
                Define your requirements and connect with pre-verified ITI talent instantly.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shrink-0">
              <div className="text-right">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Total Active</p>
                <p className="text-2xl font-black text-brand-navy leading-none mt-1">{myJobs.length}</p>
              </div>
              <div className="h-8 w-px bg-slate-200 mx-1"></div>
              <div className="w-10 h-10 rounded-xl bg-white text-brand-blue flex items-center justify-center shadow-md border border-slate-50 transition-transform hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <Card className="p-8 md:p-12 relative overflow-hidden border-none shadow-2xl bg-white rounded-[3rem] animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-brand-blue via-brand-navy to-emerald-400"></div>

              <div className="mb-10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-blue shadow-inner">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Job Details</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step 01: Define your requirements</p>
                </div>
              </div>

              {error && <Alert variant="error" className="mb-8 rounded-2xl">{error}</Alert>}
              {success && <Alert variant="success" className="mb-8 rounded-2xl animate-in bounce-in">{success}</Alert>}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-full">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Title</label>
                    <Input
                      name="title"
                      placeholder="e.g. Senior Electrician Trainee"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="bg-slate-50 border-transparent focus:bg-white h-14 font-bold text-slate-900 rounded-2xl focus:ring-4 focus:ring-brand-blue/10"
                    />
                    <p className="text-[9px] text-slate-400 font-medium ml-1">Use a clear, industry-standard job title.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Trade</label>
                    <div className="relative group">
                      <select
                        name="trade"
                        value={formData.trade}
                        onChange={handleChange}
                        required
                        className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition-all font-bold text-slate-700 outline-none appearance-none cursor-pointer shadow-sm group-hover:border-slate-200 border"
                      >
                        <option value="">Select trade...</option>
                        {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location / District</label>
                    <div className="relative group">
                      <select
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition-all font-bold text-slate-700 outline-none appearance-none cursor-pointer shadow-sm group-hover:border-slate-200 border"
                      >
                        <option value="">Select district...</option>
                        {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Required Certifications</label>
                    <span className="text-[9px] font-black text-brand-blue uppercase">{formData.certRequired.length} Selected</span>
                  </div>
                  <div className="flex flex-wrap gap-2 p-1">
                    {CERTIFICATIONS.map((cert) => (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => handleCertChange(cert)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-2 ${formData.certRequired.includes(cert)
                            ? 'bg-brand-blue border-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-105'
                            : 'bg-white border-slate-100 text-slate-400 hover:border-brand-blue hover:text-brand-blue'
                          }`}
                      >
                        {cert}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role Description & Responsibilities</label>
                  <textarea
                    name="description"
                    placeholder="Provide a detailed description of the day-to-day responsibilities..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="w-full p-6 rounded-[2rem] bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-brand-blue/10 transition-all font-medium text-slate-700 outline-none resize-none text-sm shadow-inner"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    loading={loading}
                    fullWidth
                    className="h-16 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-slate-900/20 hover:-translate-y-1 active:scale-95 transition-all"
                  >
                    {loading ? 'Processing...' : 'Publish Job'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Listings Column */}
          <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Management</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Updates</span>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[850px] pr-2 scrollbar-hide pb-12">
              {myJobs.map((job) => (
                <Link key={job._id} to={`/employer/jobs/${job._id}/candidates`} className="block group">
                  <Card className="p-8 border-0 shadow-soft group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-500 bg-white relative overflow-hidden rounded-[2.5rem]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-brand-blue/10 transition-colors duration-700"></div>

                    <div className="relative z-10 flex flex-col gap-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="text-lg font-black text-slate-900 group-hover:text-brand-blue transition-colors leading-tight">{job.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-slate-100 text-slate-500 border-none text-[9px] font-black uppercase tracking-widest px-2">{job.trade}</Badge>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{job.district}</span>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-brand-blue group-hover:bg-brand-blue/10 group-hover:border-brand-blue/20 transition-all">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400">
                              {String.fromCharCode(64 + i)}
                            </div>
                          ))}
                          <div className="w-7 h-7 rounded-full bg-brand-blue text-white border-2 border-white flex items-center justify-center text-[8px] font-black shadow-lg">
                            +
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest group-hover:translate-x-1 transition-transform">Match Talent</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}

              {myJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center p-16 text-center bg-white/50 backdrop-blur-sm rounded-[3rem] border-4 border-dashed border-slate-200/50">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-200 mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">No Active Listings</h4>
                  <p className="text-xs text-slate-400 font-medium max-w-[200px] mx-auto leading-relaxed">Your posted opportunities will appear here for management.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;