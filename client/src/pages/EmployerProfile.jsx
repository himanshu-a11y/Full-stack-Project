import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getCountries, getStates, getDistricts } from '../api/locations';

const EmployerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [updating, setUpdating] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/employer/profile');
        setProfile(res.data.employer);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const loadCountries = async () => {
      const data = await getCountries();
      setCountries(data);
    };
    loadCountries();
  }, []);

  useEffect(() => {
    const country = formData.country || profile?.country || 'India';
    const loadStates = async () => {
      const data = await getStates(country);
      setStates(data);
    };
    loadStates();
  }, [formData.country, profile?.country]);

  useEffect(() => {
    const country = formData.country || profile?.country || 'India';
    const state = formData.state || profile?.state || '';
    const loadDistricts = async () => {
      const data = await getDistricts(country, state);
      setDistricts(data);
    };
    loadDistricts();
  }, [formData.country, formData.state, profile?.country, profile?.state]);

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

  const handleEditClick = () => {
    setFormData(profile || {});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    if (e.target.name === 'country') {
      setFormData({ ...formData, country: e.target.value, state: '', district: '' });
      return;
    }
    if (e.target.name === 'state') {
      setFormData({ ...formData, state: e.target.value, district: '' });
      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setUpdating(true);
    try {
      const res = await axios.put('/api/employer/profile', formData);
      setProfile(res.data.employer);
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
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-blue rounded-full animate-spin"></div>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#F0FDF4] h-screen overflow-hidden font-sans">
      <div className="hidden md:block h-full shrink-0">
        <Sidebar links={sidebarLinks} title="EMPLOYER NAVIGATION" roleBadge={{ type: 'employer', label: 'Employer Hub' }} user={profile} />
      </div>

      <div className="flex-1 overflow-y-auto h-screen p-6 lg:p-12 max-w-5xl mx-auto w-full scrollbar-hide">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Company Profile</h1>
            <p className="text-slate-500 mt-1">Manage your organization's public information.</p>
          </div>
          {isEditing ? (
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCancelEdit} disabled={updating}>Cancel</Button>
              <Button onClick={handleSave} loading={updating}>Save Profile</Button>
            </div>
          ) : (
            <Button variant="outline" onClick={handleEditClick}>Edit Profile</Button>
          )}
        </div>

        <Card className="p-8 mb-8 border-0 shadow-soft">
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Company Name" name="companyName" value={formData.companyName || ''} onChange={handleChange} />
                <Input label="Work Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Input label="Contact Phone" name="phone" value={formData.phone || ''} onChange={handleChange} />
                <Input label="Website URL" name="website" value={formData.website || ''} onChange={handleChange} />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Country</label>
                  <select name="country" value={formData.country || 'India'} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-brand-blue">
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <select name="state" value={formData.state || ''} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-brand-blue">
                    <option value="">Select state...</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">District / City</label>
                  <select name="district" value={formData.district || ''} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-brand-blue" disabled={!formData.state}>
                    <option value="">Select district...</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Company Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="4" className="w-full px-4 py-3 text-sm rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-brand-blue outline-none resize-none" placeholder="Tell us about your company..."></textarea>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-brand-blue text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-brand-blue/20">
                  {profile?.companyName?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-black text-slate-900">{profile?.companyName}</h2>
                    {profile?.isVerified ? (
                      <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Verified Partner
                      </span>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                        Verification Pending
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {profile?.district || profile?.city || 'Location not set'}, {profile?.state || ''}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 border-t border-slate-50 pt-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      <p className="flex items-center gap-3 text-sm text-slate-600">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {profile?.email}
                      </p>
                      {profile?.phone && (
                        <p className="flex items-center gap-3 text-sm text-slate-600">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                          {profile?.phone}
                        </p>
                      )}
                      {profile?.website && (
                        <p className="flex items-center gap-3 text-sm text-slate-600">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                          <a href={profile?.website} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">{profile?.website}</a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">About the Company</h3>
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    {profile?.description || "No description provided yet. Edit your profile to tell candidates more about your company culture and mission."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EmployerProfile;
