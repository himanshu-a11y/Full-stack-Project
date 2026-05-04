import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    unverifiedCount: 0,
    totalJobs: 0,
    recentImports: []
  });
  const [unverifiedStudents, setUnverifiedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());
  const [syncText, setSyncText] = useState('Just now');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/unverified-students')
        ]);
        
        setStats(prev => ({
          ...prev,
          totalStudents: statsRes.data.totalStudents,
          unverifiedCount: statsRes.data.unverifiedCount,
          totalJobs: statsRes.data.totalJobs,
          recentImports: [
            { id: 1, date: '2024-05-04', count: statsRes.data.totalStudents, status: 'Success' },
          ]
        }));
        setUnverifiedStudents(studentsRes.data.students);
        setLastSync(new Date());
        setSyncText('Just now');
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
    const interval = setInterval(fetchAdminData, 30000); // Poll every 30 seconds
    
    // Update the "time ago" text every 10 seconds
    const textInterval = setInterval(() => {
      const seconds = Math.floor((new Date() - lastSync) / 1000);
      if (seconds < 60) setSyncText('Just now');
      else if (seconds < 3600) setSyncText(`${Math.floor(seconds / 60)} mins ago`);
      else setSyncText('Over 1 hour ago');
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, []);

  const refreshData = () => {
    setLoading(true);
    // The useEffect will trigger again if we use a dependency, 
    // but here we can just call the function.
    const fetchAdminData = async () => {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/unverified-students')
        ]);
        setStats(prev => ({
          ...prev,
          totalStudents: statsRes.data.totalStudents,
          unverifiedCount: statsRes.data.unverifiedCount,
          totalJobs: statsRes.data.totalJobs,
        }));
        setUnverifiedStudents(studentsRes.data.students);
      } catch (err) {
        console.error("Failed to refresh stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  };

  const handleVerify = async (id) => {
    try {
      await axios.patch(`/api/admin/verify-student/${id}`);
      setUnverifiedStudents(prev => prev.filter(s => s._id !== id));
      setStats(prev => ({ ...prev, unverifiedCount: prev.unverifiedCount - 1 }));
    } catch (err) {
      alert("Failed to verify student");
    }
  };

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

  return (
    <div className="flex bg-[#F8FAFC] h-screen overflow-hidden font-sans">
      <Sidebar 
        links={sidebarLinks} 
        title="ADMIN NAVIGATION" 
        roleBadge={{ type: 'admin', label: 'Admin Panel' }}
        user={{ name: 'SkillBridge Admin' }}
      />

      <div className="flex-1 overflow-y-auto h-screen p-6 pt-24 lg:p-12 max-w-7xl mx-auto w-full scrollbar-hide">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">System Status: Operational</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin <span className="text-brand-blue">Command Center</span></h1>
            <p className="text-slate-500 mt-2 font-medium">Monitoring platform-wide activity and infrastructure.</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={refreshData}
              className="p-4 bg-white rounded-2xl shadow-lg shadow-slate-200 border border-slate-50 text-slate-400 hover:text-brand-blue hover:rotate-180 transition-all duration-700"
              title="Refresh Data"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.586m15.414 2A9 9 0 1111 21.241V18" /></svg>
            </button>
            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Sync</p>
              <p className="text-sm font-bold text-slate-900">{syncText}</p>
            </div>
          </div>
        </div>
      </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Total Alumni', value: stats.totalStudents, icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z', color: 'text-brand-blue bg-brand-blue/10' },
            { label: 'Pending Verification', value: stats.unverifiedCount, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-rose-600 bg-rose-50' },
            { label: 'Live Vacancies', value: stats.totalJobs, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'text-orange-600 bg-orange-50' },
          ].map((stat, i) => (
            <Card key={i} className="p-8 border-none bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 rounded-[2.5rem] group">
              <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                </svg>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">{stat.value.toLocaleString()}</h3>
            </Card>
          ))}
        </div>

        {/* Action Center */}
        <div className="grid lg:grid-cols-2 gap-10">
          <Card className="p-10 bg-white border-none shadow-xl shadow-slate-200/50 rounded-[3rem]">
            <h3 className="text-2xl font-black mb-8 text-slate-900 tracking-tight">System Controls</h3>
            <div className="grid grid-cols-2 gap-6">
              <Link to="/admin/import" className="p-8 bg-slate-50 rounded-[2.5rem] hover:bg-brand-blue hover:text-white transition-all group border border-slate-100">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-white/20 transition-colors">
                  <svg className="w-7 h-7 text-brand-blue group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <p className="text-sm font-black uppercase tracking-widest leading-snug">Bulk Student Import</p>
              </Link>
              <Link to="/admin/users" className="p-8 bg-slate-50 rounded-[2.5rem] hover:bg-orange-500 hover:text-white transition-all group border border-slate-100">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-white/20 transition-colors">
                  <svg className="w-7 h-7 text-orange-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <p className="text-sm font-black uppercase tracking-widest leading-snug">Global User Audit</p>
              </Link>
            </div>
          </Card>

          <Card className="p-10 bg-white border-none shadow-xl shadow-slate-200/50 rounded-[3rem] h-full flex flex-col">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Vetting Queue</h3>
                <Badge variant="orange" className="px-3 py-1 text-[10px] uppercase font-black tracking-widest">{unverifiedStudents.length} Pending</Badge>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-blue transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="SEARCH BY EMAIL OR NAME..." 
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-brand-blue/20 transition-all shadow-inner"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-hide min-h-[300px]">
              {unverifiedStudents.filter(s => 
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                s.email.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 ? (
                <div className="py-12 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No matching students found</p>
                </div>
              ) : (
                unverifiedStudents
                  .filter(s => 
                    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    s.email.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((student) => (
                  <div key={student._id} className="group flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-900 font-black">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 tracking-wide">{student.name}</p>
                        <p className="text-[10px] text-slate-500 font-bold mb-1 italic">{student.email}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{student.trade}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleVerify(student._id)}
                      className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-200 hover:scale-105 transition-all"
                    >
                      Verify
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
