import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { TRADES, DISTRICTS } from '../../../shared/constants.js';
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
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-navy"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="hidden md:block">
        <Sidebar links={sidebarLinks} title="Student Panel" />
      </div>

      <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          {isEditing ? (
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCancelEdit} disabled={updating}>Cancel</Button>
              <Button onClick={handleSave} loading={updating}>Save Changes</Button>
            </div>
          ) : (
            <Button variant="outline" onClick={handleEditClick}>Edit Profile</Button>
          )}
        </div>

        <Card className="p-8 mb-8">
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">ITI Trade</label>
                  <select
                    name="trade"
                    value={formData.trade || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-brand-navy outline-none"
                  >
                    {TRADES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">District</label>
                  <select
                    name="district"
                    value={formData.district || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-brand-navy outline-none"
                  >
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-100 pb-8 mb-8">
                <div className="w-24 h-24 rounded-full bg-brand-light text-brand-blue flex items-center justify-center text-3xl font-bold flex-shrink-0">
                  {profile?.name.charAt(0)}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{profile?.name}</h2>
                  <div className="text-gray-600 space-y-1">
                    <p className="flex items-center justify-center md:justify-start gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {profile?.email}
                    </p>
                    <p className="flex items-center justify-center md:justify-start gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      +91 {profile?.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Professional Details</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">ITI Trade</p>
                      <Badge variant="blue" className="text-sm px-3 py-1">{profile?.trade}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">District</p>
                      <Badge variant="green" className="text-sm px-3 py-1">{profile?.district}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Certifications</p>
                      <div className="flex gap-2 flex-wrap">
                        {profile?.certifications?.map(cert => (
                          <Badge key={cert} variant="orange" className="text-sm px-3 py-1">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;
