import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const AdminUserAudit = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const sidebarLinks = [
    {
      label: 'Admin Home',
      to: '/admin/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Bulk Import',
      to: '/admin/import',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      label: 'User Audit',
      to: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      label: 'System Logs',
      to: '/admin/logs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log("Fetching real user directory...");
      const res = await axios.get('/api/admin/all-users');
      console.log("Received real users:", res.data.users?.length || 0);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (role, id) => {
    try {
      const endpoint = role === 'student' ? `/api/admin/verify-student/${id}` : `/api/admin/verify-employer/${id}`;
      await axios.post(endpoint);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isVerified: true } : u));
    } catch (err) {
      alert("Failed to verify user");
    }
  };

  const toggleUserStatus = async (role, id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.patch(`/api/admin/user-status/${role}/${id}`, { status: newStatus });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, status: newStatus } : u));
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-[#F8FAFC] h-screen overflow-hidden font-sans">
      <Sidebar 
        links={sidebarLinks} 
        title="ADMIN NAVIGATION" 
        roleBadge={{ type: 'admin', label: 'Admin Panel' }}
        user={{ name: 'SkillBridge Admin' }}
      />

      <div className="flex-1 overflow-y-auto h-screen p-6 pt-24 lg:p-12 max-w-7xl mx-auto w-full scrollbar-hide">
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Global User <span className="text-brand-blue">Audit</span></h1>
            <p className="text-slate-500 mt-2 font-medium">Manage all institutional accounts across students and employers.</p>
          </div>
          <div className="relative group min-w-[300px]">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-blue transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input 
              type="text" 
              placeholder="SEARCH ALL USERS..." 
              className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-xl shadow-slate-200/50"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="p-0 border-none bg-white shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">User Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Role</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Verification</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-slate-100 border-t-brand-blue rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Fetching User Directory...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-24 text-center">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No users found matching your search</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={`${user.role}-${user._id}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                            user.role === 'student' ? 'bg-blue-50 text-brand-blue' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {user.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold mb-1">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          user.role === 'student' ? 'bg-blue-100 text-brand-blue' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          user.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        {user.isVerified ? (
                          <Badge variant="green" className="text-[9px] px-2 py-0.5">Verified</Badge>
                        ) : (
                          <Badge variant="orange" className="text-[9px] px-2 py-0.5">Pending</Badge>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          {!user.isVerified && (
                            <button 
                              onClick={() => handleVerify(user.role, user._id)}
                              className="px-4 py-2 bg-brand-blue/10 text-brand-blue rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all"
                            >
                              Verify
                            </button>
                          )}
                          <button 
                            onClick={() => toggleUserStatus(user.role, user._id, user.status || 'active')}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              (user.status || 'active') === 'active' 
                                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            }`}
                          >
                            {(user.status || 'active') === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminUserAudit;
