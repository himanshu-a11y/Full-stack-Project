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
    <div className="flex bg-slate-900 min-h-[calc(100vh-64px)] transition-colors duration-500">
      <div className="hidden md:block">
        <Sidebar links={sidebarLinks} title="ADMIN PANEL" />
      </div>

      <div className="flex-1 p-6 md:p-10 max-w-7xl mx-auto overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight">System <span className="text-brand-blue">Overview</span></h1>
          <p className="text-slate-400 mt-2 font-medium">Global platform statistics and administrative control.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Students', value: stats.totalStudents, color: 'from-blue-600 to-indigo-700' },
            { label: 'Total Employers', value: stats.totalEmployers, color: 'from-emerald-500 to-teal-600' },
            { label: 'Active Jobs', value: stats.totalJobs, color: 'from-amber-500 to-orange-600' },
          ].map((stat, i) => (
            <Card key={i} className={`p-8 border-none bg-gradient-to-br ${stat.color} text-white shadow-xl`}>
              <p className="text-sm font-black uppercase tracking-widest opacity-80 mb-2">{stat.label}</p>
              <h3 className="text-4xl font-black">{stat.value.toLocaleString()}</h3>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 bg-slate-800 border-none shadow-soft">
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Quick Controls</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/import" className="p-6 bg-slate-700/50 rounded-3xl hover:bg-brand-blue transition-all group text-center border border-slate-700">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20">
                  <svg className="w-6 h-6 text-brand-blue group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <span className="text-sm font-bold text-white uppercase tracking-widest">Bulk Import</span>
              </Link>
              <div className="p-6 bg-slate-700/50 rounded-3xl hover:bg-slate-700 transition-all text-center border border-slate-700 opacity-50 cursor-not-allowed">
                <div className="w-12 h-12 bg-slate-600/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">User Mgmt</span>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-slate-800 border-none shadow-soft">
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Recent Imports</h3>
            <div className="space-y-4">
              {stats.recentImports.map((imp) => (
                <div key={imp.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                  <div>
                    <p className="text-sm font-bold text-white">Import #{imp.id}</p>
                    <p className="text-xs text-slate-500 font-medium">{imp.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-brand-blue">{imp.count} records</p>
                    <Badge variant={imp.status === 'Success' ? 'green' : 'error'}>{imp.status}</Badge>
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
