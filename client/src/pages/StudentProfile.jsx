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
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-slate-100 border-t-brand-blue rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex bg-[#F0FDF4] h-screen overflow-hidden font-sans">
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar
          links={sidebarLinks}
          title="NAVIGATION"
          roleBadge={{ type: 'student', label: 'Student Portal' }}
          user={profile}
        />
      </div>

      <div className="flex-1 overflow-y-auto h-screen p-6 lg:px-12 lg:py-10 max-w-7xl mx-auto w-full scrollbar-hide">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em]">Profile Dashboard</span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile.trade || 'Professional'}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student <span className="text-brand-blue">Profile</span></h1>
          </div>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              Edit Details
            </button>
          )}
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Personal Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-0 border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden rounded-[2.5rem]">
              <div className="h-24 bg-gradient-to-r from-brand-blue to-emerald-400 relative">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-white p-1.5 shadow-xl">
                    <div className="w-full h-full rounded-[1.2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl font-black text-brand-blue">
                      {profile.name?.charAt(0)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-14 pb-8 px-6 text-center">
                <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">{profile.name}</h2>
                <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-6">{profile.trade || 'ITI Graduate'}</p>

                <div className="space-y-3">
                  {[
                    { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', val: profile.email },
                    { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', val: profile.phone ? `+91 ${profile.phone}` : 'No phone' },
                    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', val: profile.district || 'Location' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100/50">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} /></svg>
                      <span className="text-[11px] font-bold text-slate-600 truncate">{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Redesigned Verification Trust Card */}
            <div className="p-5 bg-gradient-to-br from-emerald-50/50 to-white rounded-[2rem] border border-emerald-100/50 shadow-lg shadow-emerald-500/5 group hover:shadow-emerald-500/10 transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-[10deg] transition-transform">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Security Verified</h4>
                </div>
                <div className="px-2.5 py-1 bg-emerald-100/50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-200/50">Level 01</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-800 tracking-tight">Verified Candidate</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {isEditing ? (
              <Card className="p-8 md:p-10 border-0 shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Edit Professional Identity</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <Input label="Full Name" name="name" value={formData.name || ''} onChange={handleChange} />
                  <Input label="Email Address" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
                </div>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <Input label="Phone Number" name="phone" value={formData.phone || ''} onChange={handleChange} />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ITI Specialization</label>
                    <select
                      name="trade"
                      value={formData.trade || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 text-sm font-bold rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
                    >
                      {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-10">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current District</label>
                  <select
                    name="district"
                    value={formData.district || ''}
                    onChange={handleChange}
                    className="w-full mt-1.5 px-4 py-3 text-sm font-bold rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
                  >
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-6 pt-8 border-t border-slate-50">
                  <button onClick={handleSave} disabled={updating} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-xl shadow-slate-900/10">
                    {updating ? 'Saving...' : 'Update Profile'}
                  </button>
                  <button onClick={handleCancelEdit} className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-colors">Discard</button>
                </div>
              </Card>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-8 border-0 shadow-lg shadow-slate-200/40 bg-white rounded-[2rem] group hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expertise Area</h3>
                      <div className="p-2 bg-brand-blue/10 rounded-lg text-brand-blue">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                    </div>
                    <p className="text-xl font-black text-slate-900 mb-1">{profile.trade || 'Not Set'}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Primary ITI Trade</p>
                  </Card>

                  <Card className="p-8 border-0 shadow-lg shadow-slate-200/40 bg-white rounded-[2rem] group hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certifications</h3>
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {profile.certifications?.map(c => (
                        <span key={c} className="flex items-center gap-2 text-[11px] font-black bg-blue-50/50 border border-blue-100 px-4 py-2 rounded-xl uppercase text-brand-blue shadow-sm">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          {c}
                        </span>
                      )) || <span className="text-sm font-bold text-slate-300 italic">None Added</span>}
                    </div>
                  </Card>
                </div>

                <Card className="p-8 border-0 shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem]">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Application Intelligence</h3>
                    <button className="text-[9px] font-black text-brand-blue uppercase tracking-widest hover:underline">Full Analytics</button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { label: 'Sent', val: '12', color: 'text-slate-900 bg-slate-50' },
                      { label: 'Active', val: '04', color: 'text-brand-blue bg-brand-blue/5' },
                      { label: 'Offers', val: '01', color: 'text-emerald-600 bg-emerald-50' }
                    ].map((stat, i) => (
                      <div key={i} className={`p-6 rounded-3xl ${stat.color} border border-transparent hover:border-slate-100 transition-all text-center`}>
                        <p className="text-3xl font-black tracking-tighter mb-1">{stat.val}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-brand-blue to-brand-navy text-white shadow-2xl shadow-brand-blue/20 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                  <div className="relative z-10 text-center md:text-left">
                    <h3 className="text-xl font-black tracking-tight mb-1">Career Growth Pipeline</h3>
                    <p className="text-xs text-white/70 font-medium tracking-wide">Optimize your profile to increase employer discovery by 45%.</p>
                  </div>
                  <button
                    onClick={handleEditClick}
                    className="relative z-10 px-8 py-3 bg-white text-brand-navy rounded-xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform shadow-xl active:scale-95"
                  >
                    Optimize Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
