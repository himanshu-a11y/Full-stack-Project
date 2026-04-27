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
      to: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11v-5m0 0V9m0 5h.01M9 15h6" />
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
    <div className="flex bg-[#F8F9FA] min-h-[calc(100vh-64px)] font-sans">
      <div className="hidden md:block">
        <Sidebar links={sidebarLinks} title="MENU" />
      </div>

      <div className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto w-full">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
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
          {/* Main Card - Internshala Style */}
          <Card className="p-0 border border-slate-200 shadow-sm bg-white overflow-hidden rounded-xl">
            <div className="p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-4xl font-bold text-[#00A5EC] shadow-inner">
                  {profile.name?.charAt(0) || '?'}
                </div>
                <div className="text-center md:text-left pt-2">
                  <h2 className="text-3xl font-bold text-slate-900 mb-1">{profile.name}</h2>
                  <p className="text-lg text-slate-500 font-medium mb-4">{profile.trade || 'Professional Student'}</p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {profile.email}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {profile.district || 'Location not set'}
                    </div>
                  </div>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="grid md:grid-cols-2 gap-8">
                    <Input label="Full Name" name="name" value={formData.name || ''} onChange={handleChange} />
                    <Input label="Email Address" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <Input label="Phone Number" name="phone" value={formData.phone || ''} onChange={handleChange} />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-slate-700">ITI Specialty Trade</label>
                      <select
                        name="trade"
                        value={formData.trade || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-[#00A5EC] focus:border-[#00A5EC] outline-none transition-all"
                      >
                        <option value="">Select specialty...</option>
                        {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 max-w-md">
                    <label className="text-sm font-bold text-slate-700">Current Location (District)</label>
                    <select
                      name="district"
                      value={formData.district || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-[#00A5EC] focus:border-[#00A5EC] outline-none transition-all"
                    >
                      <option value="">Select location...</option>
                      {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                    <button onClick={handleSave} disabled={updating} className="bg-[#00A5EC] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#008cc9] transition-all disabled:opacity-50">
                      {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={handleCancelEdit} className="text-slate-500 font-bold hover:text-slate-800">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Educational Background</h3>
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                         <p className="text-xs text-slate-400 font-bold uppercase mb-1">Trade Specialization</p>
                         <p className="text-slate-800 font-semibold">{profile.trade || 'Not Specified'}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Contact Details</h3>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center py-2 border-b border-slate-50">
                           <span className="text-sm text-slate-500">Phone Number</span>
                           <span className="text-sm font-semibold text-slate-800">+91 {profile.phone || '—'}</span>
                         </div>
                         <div className="flex justify-between items-center py-2 border-b border-slate-50">
                           <span className="text-sm text-slate-500">Email Address</span>
                           <span className="text-sm font-semibold text-slate-800">{profile.email}</span>
                         </div>
                         <div className="flex justify-between items-center py-2">
                           <span className="text-sm text-slate-500">Preferred City</span>
                           <span className="text-sm font-semibold text-slate-800">{profile.district || '—'}</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Skills & Certifications</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.certifications?.length > 0 ? (
                          profile.certifications.map(cert => (
                            <span key={cert} className="px-4 py-1.5 bg-blue-50 text-[#00A5EC] text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wide">
                              {cert}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-slate-400 italic">No skills added yet.</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-6 rounded-2xl bg-[#00A5EC]/5 border border-blue-100">
                       <h4 className="text-sm font-bold text-[#00A5EC] mb-3">Job Seeking Status</h4>
                       <div className="flex items-center gap-3">
                         <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                         <span className="text-sm font-semibold text-slate-700 capitalize">{profile.status || 'Actively Searching'}</span>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Activity Section */}
          {!isEditing && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white border border-slate-200 rounded-xl text-center shadow-sm">
                   <p className="text-2xl font-bold text-slate-800">12</p>
                   <p className="text-xs text-slate-400 font-bold uppercase mt-1">Applications</p>
                </div>
                <div className="p-6 bg-white border border-slate-200 rounded-xl text-center shadow-sm">
                   <p className="text-2xl font-bold text-slate-800">04</p>
                   <p className="text-xs text-slate-400 font-bold uppercase mt-1">Shortlisted</p>
                </div>
                <div className="p-6 bg-[#00A5EC] border border-[#00A5EC] rounded-xl text-center shadow-md">
                   <p className="text-2xl font-bold text-white">02</p>
                   <p className="text-xs text-white/70 font-bold uppercase mt-1">Interview Invites</p>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
