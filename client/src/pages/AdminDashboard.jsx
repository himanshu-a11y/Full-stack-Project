import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import Sidebar from '../components/ui/Sidebar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalEmployers: 0,
    totalJobs: 0,
    recentImports: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mocking stats for now - replace with actual API calls later
        setStats({
          totalStudents: 1250,
          totalEmployers: 45,
          totalJobs: 180,
          recentImports: [
            { id: 1, date: '2024-04-28', count: 150, status: 'Success' },
            { id: 2, date: '2024-04-25', count: 85, status: 'Success' },
            { id: 3, date: '2024-04-20', count: 12, status: 'Failed' },
          ]
        });
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
      <div className="hidden lg:block h-full shrink-0">
        <Sidebar 
          links={sidebarLinks} 
          title="ADMIN NAVIGATION" 
          roleBadge={{ type: 'admin', label: 'Admin Panel' }}
          user={{ name: 'SkillBridge Admin' }}
        />
      </div>

      <div className="flex-1 overflow-y-auto h-screen p-6 lg:p-12 max-w-7xl mx-auto w-full scrollbar-hide">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">System Status: Operational</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin <span className="text-brand-blue">Command Center</span></h1>
            <p className="text-slate-500 mt-2 font-medium">Monitoring platform-wide activity and infrastructure.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="pr-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Sync</p>
              <p className="text-sm font-bold text-slate-900">2 mins ago</p>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: 'Registered Students', value: stats.totalStudents, icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z', color: 'text-brand-blue bg-brand-blue/10' },
            { label: 'Partner Employers', value: stats.totalEmployers, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Active Vacancies', value: stats.totalJobs, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'text-orange-600 bg-orange-50' },
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
          <Card className="p-10 bg-slate-900 border-none shadow-2xl shadow-slate-900/20 rounded-[3rem] text-white">
            <h3 className="text-2xl font-black mb-8 tracking-tight">System Controls</h3>
            <div className="grid grid-cols-2 gap-6">
              <Link to="/admin/import" className="p-8 bg-white/10 rounded-[2.5rem] hover:bg-brand-blue transition-all group border border-white/5">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <p className="text-sm font-black uppercase tracking-widest leading-snug">Bulk Student Import</p>
              </Link>
              <div className="p-8 bg-white/5 rounded-[2.5rem] opacity-40 cursor-not-allowed border border-white/5">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <p className="text-sm font-black uppercase tracking-widest leading-snug">Global User Audit</p>
              </div>
            </div>
          </Card>

          <Card className="p-10 bg-white border-none shadow-xl shadow-slate-200/50 rounded-[3rem]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Data Syncs</h3>
              <button className="text-xs font-black text-brand-blue uppercase tracking-widest hover:underline">View History</button>
            </div>
            <div className="space-y-6">
              {stats.recentImports.map((imp) => (
                <div key={imp.id} className="group flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] hover:bg-slate-100/50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${imp.status === 'Success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {imp.status === 'Success' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 tracking-wide">Sync Batch #{imp.id}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{imp.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{imp.count}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Profiles</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
