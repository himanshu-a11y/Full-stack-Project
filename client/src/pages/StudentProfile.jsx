import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { TRADES, DISTRICTS } from '../shared/constants.js';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/student/profile');
        setProfile(res.data.student);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
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

  const handleEditClick = () => {
    setFormData(profile || {});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setUpdating(true);
    try {
      const res = await axios.put('/api/student/profile', formData);
      setProfile(res.data.student);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-[#00A5EC] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-sm w-full border-0 shadow-xl">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Session Expired</h2>
          <p className="text-slate-500 mb-6">Please log in to your student account.</p>
          <Button onClick={() => window.location.href = '/student/login'} fullWidth className="bg-[#00A5EC] hover:bg-[#008cc9]">Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex bg-brand-mint min-h-[calc(100vh-80px)] font-sans">
      <div className="hidden lg:block">
        <Sidebar links={sidebarLinks} title="NAVIGATION" />
      </div>

      <div className="flex-1 p-6 lg:p-12 max-w-6xl mx-auto w-full">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2">
              <span>SkillBridge</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
              <span className="text-brand-blue">My Professional Profile</span>
            </nav>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Student <span className="text-brand-blue">Profile</span></h1>
          </div>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="text-[#00A5EC] font-bold text-sm border border-[#00A5EC] px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              Edit Profile
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Main Card - Internshala Style refined */}
          <Card className="p-0 border-0 shadow-soft bg-white overflow-hidden rounded-[2rem] hover:shadow-card-hover transition-all duration-500">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12">
                <div className="relative group">
                  <div className="w-28 h-28 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/50 flex items-center justify-center text-5xl font-black text-brand-blue shadow-inner group-hover:rotate-3 transition-transform duration-500">
                    {profile.name?.charAt(0) || '?'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full shadow-lg"></div>
                </div>
                <div className="text-center md:text-left pt-4">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{profile.name}</h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-brand-blue/5 text-brand-blue text-xs font-black uppercase tracking-widest rounded-full border border-brand-blue/10">
                      {profile.trade || 'Professional Student'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                    <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      {profile.email}
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      {profile.district || 'Location not set'}
                    </div>
                  </div>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid md:grid-cols-2 gap-8">
                    <Input label="Full Name" name="name" value={formData.name || ''} onChange={handleChange} />
                    <Input label="Email Address" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <Input label="Phone Number" name="phone" value={formData.phone || ''} onChange={handleChange} />
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">ITI Specialty Trade</label>
                      <select
                        name="trade"
                        value={formData.trade || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 text-sm font-bold rounded-2xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
                      >
                        <option value="">Select specialty...</option>
                        {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 max-w-md">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Current Location (District)</label>
                    <select
                      name="district"
                      value={formData.district || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 text-sm font-bold rounded-2xl border border-slate-200 bg-slate-50/50 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
                    >
                      <option value="">Select location...</option>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-6 pt-10 border-t border-slate-100">
                    <button onClick={handleSave} disabled={updating} className="bg-brand-blue text-white px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-lg hover:shadow-brand-blue/30 hover:-translate-y-0.5 transition-all disabled:opacity-50">
                      {updating ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button onClick={handleCancelEdit} className="text-slate-400 font-bold hover:text-slate-800 transition-colors">Discard Changes</button>
                  </div>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-16 pt-12 border-t border-slate-100">
                  <div className="space-y-12">
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Educational Background</h3>
                      <div className="p-6 rounded-[1.5rem] bg-slate-50/50 border border-slate-100/50 group hover:bg-white hover:shadow-soft transition-all duration-300">
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2">Trade Specialization</p>
                        <p className="text-slate-900 font-bold text-lg">{profile.trade || 'Not Specified'}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Contact Details</h3>
                      <div className="space-y-2">
                        {[
                          { label: 'Phone Number', value: profile.phone ? `+91 ${profile.phone}` : '—' },
                          { label: 'Email Address', value: profile.email },
                          { label: 'Preferred City', value: profile.district || '—' }
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center p-4 rounded-xl hover:bg-slate-50/50 transition-colors">
                            <span className="text-sm font-bold text-slate-400">{item.label}</span>
                            <span className="text-sm font-black text-slate-900">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Skills & Certifications</h3>
                      <div className="flex flex-wrap gap-3">
                        {profile.certifications?.length > 0 ? (
                          profile.certifications.map(cert => (
                            <span key={cert} className="px-5 py-2 bg-white text-brand-blue text-xs font-black rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all uppercase tracking-wide">
                              {cert}
                            </span>
                          ))
                        ) : (
                          <div className="p-6 w-full rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center">
                            <p className="text-sm text-slate-400 font-bold">No skills added yet.</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-brand-blue/5 border border-brand-blue/10 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                      <h4 className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] mb-4">Job Seeking Status</h4>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                          <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-40"></div>
                        </div>
                        <span className="text-lg font-black text-slate-900 tracking-tight">{profile.status || 'Active'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Activity Section - Floating Stats */}
          {!isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { val: '12', label: 'Applications', color: 'bg-white text-slate-900', border: 'border-slate-200/60' },
                { val: '04', label: 'Shortlisted', color: 'bg-white text-slate-900', border: 'border-slate-200/60' },
                { val: '02', label: 'Interview Invites', color: 'bg-brand-blue text-white', border: 'border-brand-blue', shadow: 'shadow-lg shadow-brand-blue/20' }
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`p-8 ${stat.color} ${stat.border} ${stat.shadow || 'shadow-soft'} rounded-[2rem] text-center hover:-translate-y-1.5 hover:shadow-xl transition-all duration-500 cursor-pointer group`}
                >
                  <p className="text-4xl font-black tracking-tighter mb-2 group-hover:scale-110 transition-transform duration-500">{stat.val}</p>
                  <p className={`text-[10px] ${stat.label === 'Interview Invites' ? 'text-white/70' : 'text-slate-400'} font-black uppercase tracking-[0.2em]`}>{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
